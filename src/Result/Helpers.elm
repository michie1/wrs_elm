module Result.Helpers exposing (resultExists, calcResultId)

import Result.Model exposing (Add)
import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import Rider.Model


resultExists : Result.Model.Result -> List Result.Model.Result -> Bool
resultExists result results =
    (List.length
        (List.filter
            (\r -> r.raceKey == result.raceKey && r.riderId == result.riderId)
            results
        )
    )
        /= 0


calcResultId : List Result.Model.Result -> Int
calcResultId results =
    (List.length results) + 1
