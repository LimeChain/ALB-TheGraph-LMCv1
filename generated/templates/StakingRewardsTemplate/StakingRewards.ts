// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class RewardAdded extends ethereum.Event {
  get params(): RewardAdded__Params {
    return new RewardAdded__Params(this);
  }
}

export class RewardAdded__Params {
  _event: RewardAdded;

  constructor(event: RewardAdded) {
    this._event = event;
  }

  get token(): Array<Address> {
    return this._event.parameters[0].value.toAddressArray();
  }

  get reward(): Array<BigInt> {
    return this._event.parameters[1].value.toBigIntArray();
  }
}

export class RewardExtended extends ethereum.Event {
  get params(): RewardExtended__Params {
    return new RewardExtended__Params(this);
  }
}

export class RewardExtended__Params {
  _event: RewardExtended;

  constructor(event: RewardExtended) {
    this._event = event;
  }

  get rewardToken(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get rewardAmount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get date(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get periodToExtend(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class RewardPaid extends ethereum.Event {
  get params(): RewardPaid__Params {
    return new RewardPaid__Params(this);
  }
}

export class RewardPaid__Params {
  _event: RewardPaid;

  constructor(event: RewardPaid) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get rewardToken(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get rewardAmount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Staked extends ethereum.Event {
  get params(): Staked__Params {
    return new Staked__Params(this);
  }
}

export class Staked__Params {
  _event: Staked;

  constructor(event: Staked) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class Withdrawn extends ethereum.Event {
  get params(): Withdrawn__Params {
    return new Withdrawn__Params(this);
  }
}

export class Withdrawn__Params {
  _event: Withdrawn;

  constructor(event: Withdrawn) {
    this._event = event;
  }

  get user(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class StakingRewards__rewardsTokensMapResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }
}

export class StakingRewards extends ethereum.SmartContract {
  static bind(address: Address): StakingRewards {
    return new StakingRewards("StakingRewards", address);
  }

  rewardsAmountsArr(param0: BigInt): BigInt {
    let result = super.call(
      "rewardsAmountsArr",
      "rewardsAmountsArr(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toBigInt();
  }

  try_rewardsAmountsArr(param0: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "rewardsAmountsArr",
      "rewardsAmountsArr(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  rewardsDistributor(): Address {
    let result = super.call(
      "rewardsDistributor",
      "rewardsDistributor():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_rewardsDistributor(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "rewardsDistributor",
      "rewardsDistributor():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  rewardsTokensArr(param0: BigInt): Address {
    let result = super.call(
      "rewardsTokensArr",
      "rewardsTokensArr(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return result[0].toAddress();
  }

  try_rewardsTokensArr(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "rewardsTokensArr",
      "rewardsTokensArr(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  rewardsTokensMap(param0: Address): StakingRewards__rewardsTokensMapResult {
    let result = super.call(
      "rewardsTokensMap",
      "rewardsTokensMap(address):(uint256,uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return new StakingRewards__rewardsTokensMapResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt()
    );
  }

  try_rewardsTokensMap(
    param0: Address
  ): ethereum.CallResult<StakingRewards__rewardsTokensMapResult> {
    let result = super.tryCall(
      "rewardsTokensMap",
      "rewardsTokensMap(address):(uint256,uint256,uint256,uint256,uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new StakingRewards__rewardsTokensMapResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt()
      )
    );
  }

  stakingToken(): Address {
    let result = super.call("stakingToken", "stakingToken():(address)", []);

    return result[0].toAddress();
  }

  try_stakingToken(): ethereum.CallResult<Address> {
    let result = super.tryCall("stakingToken", "stakingToken():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getRewardsTokensCount(): BigInt {
    let result = super.call(
      "getRewardsTokensCount",
      "getRewardsTokensCount():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_getRewardsTokensCount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getRewardsTokensCount",
      "getRewardsTokensCount():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getUserRewardPerTokenRecorded(rewardToken: Address, user: Address): BigInt {
    let result = super.call(
      "getUserRewardPerTokenRecorded",
      "getUserRewardPerTokenRecorded(address,address):(uint256)",
      [
        ethereum.Value.fromAddress(rewardToken),
        ethereum.Value.fromAddress(user)
      ]
    );

    return result[0].toBigInt();
  }

  try_getUserRewardPerTokenRecorded(
    rewardToken: Address,
    user: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getUserRewardPerTokenRecorded",
      "getUserRewardPerTokenRecorded(address,address):(uint256)",
      [
        ethereum.Value.fromAddress(rewardToken),
        ethereum.Value.fromAddress(user)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getUserReward(rewardToken: Address, user: Address): BigInt {
    let result = super.call(
      "getUserReward",
      "getUserReward(address,address):(uint256)",
      [
        ethereum.Value.fromAddress(rewardToken),
        ethereum.Value.fromAddress(user)
      ]
    );

    return result[0].toBigInt();
  }

  try_getUserReward(
    rewardToken: Address,
    user: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getUserReward",
      "getUserReward(address,address):(uint256)",
      [
        ethereum.Value.fromAddress(rewardToken),
        ethereum.Value.fromAddress(user)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalStakesAmount(): BigInt {
    let result = super.call(
      "totalStakesAmount",
      "totalStakesAmount():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_totalStakesAmount(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalStakesAmount",
      "totalStakesAmount():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  balanceOf(account: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(account)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(account: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(account)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getRewardForDuration(rewardToken: Address): BigInt {
    let result = super.call(
      "getRewardForDuration",
      "getRewardForDuration(address):(uint256)",
      [ethereum.Value.fromAddress(rewardToken)]
    );

    return result[0].toBigInt();
  }

  try_getRewardForDuration(rewardToken: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getRewardForDuration",
      "getRewardForDuration(address):(uint256)",
      [ethereum.Value.fromAddress(rewardToken)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  hasPeriodStarted(): boolean {
    let result = super.call(
      "hasPeriodStarted",
      "hasPeriodStarted():(bool)",
      []
    );

    return result[0].toBoolean();
  }

  try_hasPeriodStarted(): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "hasPeriodStarted",
      "hasPeriodStarted():(bool)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  lastTimeRewardApplicable(rewardToken: Address): BigInt {
    let result = super.call(
      "lastTimeRewardApplicable",
      "lastTimeRewardApplicable(address):(uint256)",
      [ethereum.Value.fromAddress(rewardToken)]
    );

    return result[0].toBigInt();
  }

  try_lastTimeRewardApplicable(
    rewardToken: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "lastTimeRewardApplicable",
      "lastTimeRewardApplicable(address):(uint256)",
      [ethereum.Value.fromAddress(rewardToken)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  rewardPerToken(rewardToken: Address): BigInt {
    let result = super.call(
      "rewardPerToken",
      "rewardPerToken(address):(uint256)",
      [ethereum.Value.fromAddress(rewardToken)]
    );

    return result[0].toBigInt();
  }

  try_rewardPerToken(rewardToken: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "rewardPerToken",
      "rewardPerToken(address):(uint256)",
      [ethereum.Value.fromAddress(rewardToken)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  earned(account: Address, rewardToken: Address): BigInt {
    let result = super.call("earned", "earned(address,address):(uint256)", [
      ethereum.Value.fromAddress(account),
      ethereum.Value.fromAddress(rewardToken)
    ]);

    return result[0].toBigInt();
  }

  try_earned(
    account: Address,
    rewardToken: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall("earned", "earned(address,address):(uint256)", [
      ethereum.Value.fromAddress(account),
      ethereum.Value.fromAddress(rewardToken)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getPeriodsToExtend(rewardToken: Address, rewardAmount: BigInt): BigInt {
    let result = super.call(
      "getPeriodsToExtend",
      "getPeriodsToExtend(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(rewardToken),
        ethereum.Value.fromUnsignedBigInt(rewardAmount)
      ]
    );

    return result[0].toBigInt();
  }

  try_getPeriodsToExtend(
    rewardToken: Address,
    rewardAmount: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getPeriodsToExtend",
      "getPeriodsToExtend(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(rewardToken),
        ethereum.Value.fromUnsignedBigInt(rewardAmount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  hasPeriodFinished(): boolean {
    let result = super.call(
      "hasPeriodFinished",
      "hasPeriodFinished():(bool)",
      []
    );

    return result[0].toBoolean();
  }

  try_hasPeriodFinished(): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "hasPeriodFinished",
      "hasPeriodFinished():(bool)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _rewardsTokens(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get _rewardsAmounts(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get _stakingToken(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _rewardsDuration(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class StakeCall extends ethereum.Call {
  get inputs(): StakeCall__Inputs {
    return new StakeCall__Inputs(this);
  }

  get outputs(): StakeCall__Outputs {
    return new StakeCall__Outputs(this);
  }
}

export class StakeCall__Inputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class StakeCall__Outputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }
}

export class ExitCall extends ethereum.Call {
  get inputs(): ExitCall__Inputs {
    return new ExitCall__Inputs(this);
  }

  get outputs(): ExitCall__Outputs {
    return new ExitCall__Outputs(this);
  }
}

export class ExitCall__Inputs {
  _call: ExitCall;

  constructor(call: ExitCall) {
    this._call = call;
  }
}

export class ExitCall__Outputs {
  _call: ExitCall;

  constructor(call: ExitCall) {
    this._call = call;
  }
}

export class StartCall extends ethereum.Call {
  get inputs(): StartCall__Inputs {
    return new StartCall__Inputs(this);
  }

  get outputs(): StartCall__Outputs {
    return new StartCall__Outputs(this);
  }
}

export class StartCall__Inputs {
  _call: StartCall;

  constructor(call: StartCall) {
    this._call = call;
  }
}

export class StartCall__Outputs {
  _call: StartCall;

  constructor(call: StartCall) {
    this._call = call;
  }
}

export class AddRewardsCall extends ethereum.Call {
  get inputs(): AddRewardsCall__Inputs {
    return new AddRewardsCall__Inputs(this);
  }

  get outputs(): AddRewardsCall__Outputs {
    return new AddRewardsCall__Outputs(this);
  }
}

export class AddRewardsCall__Inputs {
  _call: AddRewardsCall;

  constructor(call: AddRewardsCall) {
    this._call = call;
  }

  get rewardToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get rewardAmount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class AddRewardsCall__Outputs {
  _call: AddRewardsCall;

  constructor(call: AddRewardsCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class GetRewardCall extends ethereum.Call {
  get inputs(): GetRewardCall__Inputs {
    return new GetRewardCall__Inputs(this);
  }

  get outputs(): GetRewardCall__Outputs {
    return new GetRewardCall__Outputs(this);
  }
}

export class GetRewardCall__Inputs {
  _call: GetRewardCall;

  constructor(call: GetRewardCall) {
    this._call = call;
  }
}

export class GetRewardCall__Outputs {
  _call: GetRewardCall;

  constructor(call: GetRewardCall) {
    this._call = call;
  }
}
