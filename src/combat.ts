import { mpCost, myPrimestat, toInt } from "kolmafia";
import { $item, $skill, $stat, get, have, StrictMacro } from "libram";

export const mainStat = myPrimestat();

export default class Macro extends StrictMacro {
  kill(useCinch = false): Macro {
    const macroHead = this.trySkill($skill`Curse of Weaksauce`).if_(
      `!mpbelow ${mpCost($skill`Stuffed Mortar Shell`)}`,
      Macro.trySkill($skill`Stuffed Mortar Shell`)
    );
    if (myPrimestat() === $stat`Mysticality`) {
      return (useCinch ? macroHead.trySkill($skill`Cincho: Confetti Extravaganza`) : macroHead)
        .while_(
          `!mpbelow ${mpCost($skill`Saucegeyser`)} && hasskill ${toInt($skill`Saucegeyser`)}`,
          Macro.skill($skill`Saucegeyser`)
        )
        .while_(
          `!mpbelow ${mpCost($skill`Saucestorm`)} && hasskill ${toInt($skill`Saucestorm`)}`,
          Macro.skill($skill`Saucestorm`)
        )
        .attack()
        .repeat();
    } else {
      return (useCinch ? macroHead.trySkill($skill`Cincho: Confetti Extravaganza`) : macroHead)
        .while_(
          `!mpbelow ${mpCost($skill`Lunging Thrust-Smack`)} && hasskill ${toInt(
            $skill`Lunging Thrust-Smack`
          )}`,
          Macro.skill($skill`Lunging Thrust-Smack`)
        )
        .attack()
        .repeat();
    }
  }

  static kill(): Macro {
    return new Macro().kill();
  }

  default(useCinch = false): Macro {
    return this.kill(useCinch);
  }

  static default(useCinch = false): Macro {
    return new Macro().default(useCinch);
  }
}

export function main(): void {
  Macro.load().submit();
}

export function haveFreeKill(): boolean {
  // TODO: Support for Parka YR
  const haveXRay = have($item`Lil' Doctor™ bag`) && get("_chestXRayUsed") < 3;
  const haveShatteringPunch = have($skill`Shattering Punch`) && get("_shatteringPunchUsed") < 3;
  const haveMobHit = have($skill`Gingerbread Mob Hit`) && !get("_gingerbreadMobHitUsed");

  return haveXRay || haveShatteringPunch || haveMobHit;
}

export function haveFreeBanish(): boolean {
  const haveSnokeBomb = have($skill`Snokebomb`) && get("_snokebombUsed") < 3;
  const haveFeelHatred = have($skill`Feel Hatred`) && get("_feelHatredUsed") < 3;
  const haveReflexHammer = have($skill`Reflex Hammer`) && get("_reflexHammerUsed") < 3;
  const haveThrowLatte = have($skill`Throw Latte on Opponent`) && !get("_latteBanishUsed");

  return haveSnokeBomb || haveFeelHatred || haveReflexHammer || haveThrowLatte;
}
