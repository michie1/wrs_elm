module Result.Helpers exposing (resultExists, calcResultId, getRiderByName)

import Result.Model exposing (ResultAdd)
import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import Rider.Model

getRiderByName : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)


resultExists : Result.Model.Result -> List Result.Model.Result -> Bool
resultExists result results =
    (List.length
        (List.filter
            (\r -> r.raceId == result.raceId && r.riderId == result.riderId)
            results
        )
    )
        /= 0

calcResultId : List Result.Model.Result -> Int
calcResultId results =
    (List.length results) + 1
