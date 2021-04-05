import { BigInt, Bytes, json, log } from "@graphprotocol/graph-ts"
import {
  StakingRewardsFactory,
  OwnershipTransferred,
  DeployCall
} from "../generated/StakingRewardsFactory/StakingRewardsFactory"
import {
  StakingRewardsTemplate
} from '../generated/templates'
import {
  StakingRewards as StakingRewardsContract,
  RewardAdded,
  RewardExtended,
  RewardPaid,
  Staked,
  Withdrawn
} from '../generated/templates/StakingRewards/StakingRewards'
import {
  StakingRewardsContract as StakingRewardsContractEntity,
  Stake as StakeEntity,
  Withdraw as WithdrawEntity,
  RewardPaid as RewardPaidEntity
} from "../generated/schema"


export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleDeploy(call: DeployCall): void {
  let contract = StakingRewardsFactory.bind(call.to)
  let address = contract.stakingRewardsByStakingToken(call.inputs._stakingToken)

  StakingRewardsTemplate.create(address)

  let entity = new StakingRewardsContractEntity(address.toHex())
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
  let entity = RewardPaidEntity.load(event.transaction.hash.toHex())

  // error case
  if (entity != null && entity.blockNumber != event.block.number) {
    log.error('BlockNumbers not matching ', [entity.id])
    return
  }

  if (entity === null) {
    entity = new RewardPaidEntity(event.transaction.hash.toHex())

    entity.blockNumber = event.block.number
    entity.timestamp = event.block.timestamp
    entity.user = event.params.user
    entity.lmc = event.transaction.to
  }

  entity.tokens.push(event.params.rewardToken)
  entity.amounts.push(event.params.rewardAmount)

  entity.save()
}

export function handleStaked(event: Staked): void {
  // let entity = new StakeEntity(event.transaction.hash.toHex())
  // let contract = StakingRewardsContract.bind(event.address)

  // entity.blockNumber = event.block.number
  // entity.timestamp = event.block.timestamp
  // entity.user = event.params.user
  // entity.lmc = event.address
  // entity.token = contract.stakingToken()
  // entity.amount = event.params.amount

  // entity.save()
}

export function handleWithdrawn(event: Withdrawn): void {
  // let entity = new WithdrawEntity(event.transaction.hash.toHex())
  // let contract = StakingRewardsContract.bind(event.address)

  // entity.blockNumber = event.block.number
  // entity.timestamp = event.block.timestamp
  // entity.user = event.params.user
  // entity.lmc = event.transaction.to
  // entity.token = contract.stakingToken()
  // entity.amount = event.params.amount

  // entity.save()
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