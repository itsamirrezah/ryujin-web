import { PlayImp, PlayArgs } from "./use-play-online";

export default function usePlayWithComputer(args: PlayArgs): PlayImp {
    const ryujinService = args.ryujinService
    const { send } = ryujinService
    return {} as PlayImp
}
