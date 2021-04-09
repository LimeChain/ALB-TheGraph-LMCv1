import { BigInt, Bytes, Address, json, log } from "@graphprotocol/graph-ts"
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

  let array = call.inputs._rewardsTokens
  let out = new Array<Bytes>(array.length)
  for (let i = 0; i < array.length; i++) {
    out[i] = array[i]
  }

  entity.rewardsTokens = out
  entity.rewardsAmounts = call.inputs._rewardsAmounts
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
    entity = new RewardPaidEntity(event.transaction.hash.toHex())

    entity.blockNumber = event.block.number
    entity.timestamp = event.block.timestamp
    entity.user = event.params.user.toHex()
    entity.lmc = event.address.toHex()

    let stakingRewardsInstance = StakingRewards.bind(event.address)
    let rewardTokensCount = stakingRewardsInstance.getRewardsTokensCount().toI32()

    let tokens = new Array<Bytes>(rewardTokensCount)
    let amounts = new Array<BigInt>(rewardTokensCount)

    // fill up tokens array from staking contract
    // fill up amounts array with 0s
    for (let i = 0; i < rewardTokensCount; i++) {
      tokens[i] = stakingRewardsInstance.rewardsTokensArr(BigInt.fromI32(i)) // store reward token's addresses
      amounts[i] = BigInt.fromI32(0) // set 0 amounts by default
    }

    entity.tokens = tokens
    entity.amounts = amounts
  }

  // add amount
  let amounts = entity.amounts
  let index = entity.tokens.indexOf(event.params.rewardToken)
  amounts[index] = amounts[index].plus(event.params.rewardAmount)
  entity.amounts = amounts // TODO

  entity.save()

  // save in user's position
  CreateUser(event.params.user)
  UpdateUserPositionOnRewardPaid(
    event.params.user,
    event.address,
    event.block.number,
    event.params.rewardToken,
    event.params.rewardAmount,
  )
}

export function handleStaked(event: Staked): void {
  let entity = new StakeEntity(event.transaction.hash.toHex() + "-" + event.logIndex.toHex())
  let stakingRewardsInstance = StakingRewards.bind(event.address)

  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.user = event.params.user.toHex()
  entity.lmc = event.address.toHex()
  entity.token = stakingRewardsInstance.stakingToken()
  entity.amount = event.params.amount

  entity.save()

  // save in user's position
  CreateUser(event.params.user)
  UpdateUserPositionOnStake(
    event.params.user,
    event.address,
    event.block.number,
    event.params.amount,
  )
}

export function handleWithdrawn(event: Withdrawn): void {
  let entity = new WithdrawEntity(event.transaction.hash.toHex() + "-" + event.logIndex.toHex())
  let stakingRewardsInstance = StakingRewards.bind(event.address)

  entity.blockNumber = event.block.number
  entity.timestamp = event.block.timestamp
  entity.user = event.params.user.toHex()
  entity.lmc = event.address.toHex()
  entity.token = stakingRewardsInstance.stakingToken()
  entity.amount = event.params.amount

  entity.save()

  // save in user's position
  CreateUser(event.params.user)
  UpdateUserPositionOnWithdraw(
    event.params.user,
    event.address,
    event.block.number,
    event.params.amount,
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

  if (position === null) {
    position = new UserLMCPosition(positionID)
    position.lastUpdatedInBlock = BigInt.fromI32(0)
    position.user = user.toHex()
    position.lmc = lmc.toHex()
    position.active = false
    position.totalStaked = BigInt.fromI32(0)

    let stakingRewardsInstance = StakingRewards.bind(lmc)
    let rewardTokensCount = stakingRewardsInstance.getRewardsTokensCount().toI32()

    // create empty rewards amount array
    let rewards = new Array<BigInt>(rewardTokensCount)
    for (let i = 0; i < rewardTokensCount; i++) {
      rewards[i] = BigInt.fromI32(0)
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
  stakedAmount: BigInt
): void {
  let position = GetUserPosition(user, lmc)

  position.lastUpdatedInBlock = blockNumber
  position.active = true
  position.totalStaked = position.totalStaked.plus(stakedAmount)

  position.save()
}

function UpdateUserPositionOnWithdraw(
  user: Address,
  lmc: Address,
  blockNumber: BigInt,
  withdrawnAmount: BigInt // TODO: check withdrawn amount
): void {
  let position = GetUserPosition(user, lmc)

  position.lastUpdatedInBlock = blockNumber
  position.active = false
  position.totalStaked = BigInt.fromI32(0)

  position.save()
}

function UpdateUserPositionOnRewardPaid(
  user: Address,
  lmc: Address,
  blockNumber: BigInt,
  rewardToken: Address,
  rewardPaid: BigInt
): void {
  let position = GetUserPosition(user, lmc)

  position.lastUpdatedInBlock = blockNumber

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