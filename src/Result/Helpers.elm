module Result.Helpers exposing (resultExists, calcResultId)

import Result.Model exposing (Add)
import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import Rider.Model
import Data.RaceResult exposing (RaceResult)


resultExists : RaceResult -> List RaceResult -> Bool
resultExists result results =
    (List.length
        (List.filter
            (\r -> r.raceKey == result.raceKey && r.riderKey == result.riderKey)
            results
        )
    )
        /= 0


calcResultId : List RaceResult -> Int
calcResultId results =
    (List.length results) + 1
