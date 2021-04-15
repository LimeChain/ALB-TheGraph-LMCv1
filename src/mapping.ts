import { BigInt, Bytes, Address, json, log, BigDecimal } from "@graphprotocol/graph-ts"
import {
  StakingRewardsFactory,
  OwnershipTransferred,
  DeployCall
} from "../generated/StakingRewardsFactory/StakingRewardsFactory"
import {
  StakingRewardsTemplate
} from '../generated/templates'
import {
  StakingRewards,
  RewardAdded,
  RewardExtended,
  RewardPaid,
  Staked,
  Withdrawn
} from '../generated/templates/StakingRewardsTemplate/StakingRewards'
import {
  LMC,
  Stake as StakeEntity,
  Withdraw as WithdrawEntity,
  RewardPaid as RewardPaidEntity,
  User,
  UserLMCPosition
} from "../generated/schema"

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleDeploy(call: DeployCall): void {
  let contract = StakingRewardsFactory.bind(call.to)
  let address = contract.stakingRewardsByStakingToken(call.inputs._stakingToken)

  StakingRewardsTemplate.create(address)

  let entity = new LMC(address.toHex())
  entity.id = address.toHex()
  entity.blockNumber = call.block.number
  entity.timestamp = call.block.timestamp
  entity.address = address
  entity.stakingToken = call.inputs._stakingToken

  let rtArray = call.inputs._rewardsTokens
  let raArray = call.inputs._rewardsAmounts
  let len = rtArray.length
  let rt = new Array<Bytes>(len)
  let ra = new Array<BigDecimal>(len)
  for (let i = 0; i < len; i++) {
    rt[i] = rtArray[i]
    ra[i] = raArray[i].toBigDecimal()
  }

  entity.rewardsTokens = rt
  entity.rewardsAmounts = ra
  entity.rewardsDuration = call.inputs._rewardsDuration

  entity.save()
}

export function handleRewardAdded(event: RewardAdded): void {}

export function handleRewardExtended(event: RewardExtended): void {}

export function handleRewardPaid(event: RewardPaid): void {
  let entity = RewardPaidEntity.load(event.transaction.hash.toHex() + "-" + event.logIndex.toHex())

  // error case
  if (entity != null && entity.blockNumber != event.block.number) {
    log.error('BlockNumbers not matching ', [entity.id])
    return
  }

  if (entity === null) {
    entity = new RewardPaidEntity(event.transaction.hash.toHex() + "-" + event.logIndex.toHex())

    entity.blockNumber = event.block.number
    entity.timestamp = event.block.timestamp
    entity.gasPrice = event.transaction.gasPrice.toBigDecimal()
    entity.gasUsed = event.transaction.gasUsed.toBigDecimal()
    entity.user = event.params.user.toHex()
    entity.lmc = event.address.toHex()

    let stakingRewardsInstance = StakingRewards.bind(event.address)
    let rewardTokensCount = stakingRewardsInstance.getRewardsTokensCount().toI32()

    let tokens = new Array<Bytes>(rewardTokensCount)
    let amounts = new Array<BigDecimal>(rewardTokensCount)

    // fill up tokens array from staking contract
    // fill up amounts array with 0s
    for (let i = 0; i < rewardTokensCount; i++) {
      tokens[i] = stakingRewardsInstance.rewardsTokensArr(BigInt.fromI32(i)) // store reward token's addresses
      amounts[i] = new BigDecimal(BigInt.fromI32(0)) // set 0 amounts by default
    }

    entity.tokens = tokens
    entity.amounts = amounts
  }

  // add amount
  let amounts = entity.amounts
  let index = entity.tokens.indexOf(event.params.rewardToken)
  amounts[index] = amounts[index].plus(event.params.rewardAmount.toBigDecimal())
  entity.amounts = amounts // TODO

  entity.save()

  // save in user's position
  CreateUser(event.params.user)
  UpdateUserPositionOnRewardPaid(
    event.params.user,
    event.address,
    event.block.number,
    event.block.timestamp,
    event.params.rewardToken,
    event.params.rewardAmount.toBigDecimal()
  )
}

export function handleStaked(event: Staked): void {
  let entity = new StakeEntity(event.transaction.hash.toHex() + "-" + event.logIndex.toHex())
  let stakingRewardsInstance = StakingRewards.bind(event.address)

  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.gasPrice = event.transaction.gasPrice.toBigDecimal()
  entity.gasUsed = event.transaction.gasUsed.toBigDecimal()
  entity.user = event.params.user.toHex()
  entity.lmc = event.address.toHex()
  entity.token = stakingRewardsInstance.stakingToken()
  entity.amount = event.params.amount.toBigDecimal()

  entity.save()

  // save in user's position
  CreateUser(event.params.user)
  UpdateUserPositionOnStake(
    event.params.user,
    event.address,
    event.block.number,
    event.block.timestamp,
    event.params.amount.toBigDecimal()
  )
}

export function handleWithdrawn(event: Withdrawn): void {
  let entity = new WithdrawEntity(event.transaction.hash.toHex() + "-" + event.logIndex.toHex())
  let stakingRewardsInstance = StakingRewards.bind(event.address)

  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.gasPrice = event.transaction.gasPrice
  entity.gasUsed = event.transaction.gasUsed
  entity.user = event.params.user.toHex()
  entity.lmc = event.address.toHex()
  entity.token = stakingRewardsInstance.stakingToken()
  entity.amount = event.params.amount.toBigDecimal()

  entity.save()

  // save in user's position
  CreateUser(event.params.user)
  UpdateUserPositionOnWithdraw(
    event.params.user,
    event.address,
    event.block.number,
    event.block.timestamp,
    event.params.amount.toBigDecimal()
  )
}

function CreateUser(address: Address): void {
  let user = User.load(address.toHex())

  if (user === null) {
    user = new User(address.toHex())
    user.save()
  }
}

function GetUserPosition(user: Address, lmc: Address): UserLMCPosition | null {
  let positionID = user.toHex() + "-" + lmc.toHex()
  let position = UserLMCPosition.load(positionID)

  if (position === null) { // create a new position
    position = new UserLMCPosition(positionID)
    position.lastUpdatedInBlock = BigInt.fromI32(0)
    position.lastUpdateTimestamp = BigInt.fromI32(0)
    position.user = user.toHex()
    position.lmc = lmc.toHex()
    position.active = false
    position.totalStaked = new BigDecimal(BigInt.fromI32(0))

    let stakingRewardsInstance = StakingRewards.bind(lmc)
    let rewardTokensCount = stakingRewardsInstance.getRewardsTokensCount().toI32()

    // create empty rewards amount array
    let rewards = new Array<BigDecimal>(rewardTokensCount)
    for (let i = 0; i < rewardTokensCount; i++) {
      rewards[i] = new BigDecimal(BigInt.fromI32(0))
    }
    position.rewards = rewards

    position.save()
  }

  return position
}

function UpdateUserPositionOnStake(
  user: Address,
  lmc: Address,
  blockNumber: BigInt,
  timestamp: BigInt,
  stakedAmount: BigDecimal,
): void {
  let position = GetUserPosition(user, lmc)

  position.lastUpdatedInBlock = blockNumber
  position.lastUpdateTimestamp = timestamp
  position.active = true
  position.totalStaked = position.totalStaked.plus(stakedAmount)

  position.save()
}

function UpdateUserPositionOnWithdraw(
  user: Address,
  lmc: Address,
  blockNumber: BigInt,
  timestamp: BigInt,
  withdrawnAmount: BigDecimal,
): void {
  let position = GetUserPosition(user, lmc)

  if (withdrawnAmount == position.totalStaked) {
    position.lastUpdatedInBlock = blockNumber
    position.lastUpdateTimestamp = timestamp
    position.active = false
    position.totalStaked = new BigDecimal(BigInt.fromI32(0))
  } else {
    log.error("Withdraw amount is less than staked! User: ", [user.toHexString()])
  }

  position.save()
}

function UpdateUserPositionOnRewardPaid(
  user: Address,
  lmc: Address,
  blockNumber: BigInt,
  timestamp: BigInt,
  rewardToken: Address,
  rewardPaid: BigDecimal,
): void {
  let position = GetUserPosition(user, lmc)

  position.lastUpdatedInBlock = blockNumber
  position.lastUpdateTimestamp = timestamp

  let stakingRewardsInstance = StakingRewards.bind(lmc)
  let rewardTokensCount = stakingRewardsInstance.getRewardsTokensCount().toI32()

  for (let i = 0; i < rewardTokensCount; i++) {
    let address = stakingRewardsInstance.rewardsTokensArr(BigInt.fromI32(i))
    if (address == rewardToken) {
      let rewards = position.rewards
      rewards[i] = rewards[i].plus(rewardPaid)
      position.rewards = rewards // TODO
      break
    }
  }

  position.save()
}


  // - contract.hasStakingStarted(...)
  // - contract.isOwner(...)
  // - contract.owner(...)
  // - contract.stakingRewardsByStakingToken(...)
  // - contract.stakingRewardsGenesis(...)
  // - contract.stakingTokens(...)

  // - contract.rewardsAmountsArr(...)
  // - contract.rewardsDistributor(...)
  // - contract.rewardsTokensArr(...)
  // - contract.rewardsTokensMap(...)
  // - contract.stakingToken(...)
  // - contract.getRewardsTokensCount(...)
  // - contract.getUserRewardPerTokenRecorded(...)
  // - contract.getUserReward(...)
  // - contract.totalStakesAmount(...)
  // - contract.balanceOf(...)
  // - contract.getRewardForDuration(...)
  // - contract.hasPeriodStarted(...)
  // - contract.lastTimeRewardApplicable(...)
  // - contract.rewardPerToken(...)
  // - contract.earned(...)
  // - contract.getPeriodsToExtend(...)
  // - contract.hasPeriodFinished(...)