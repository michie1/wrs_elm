module Data.Payout exposing (PayoutRider, payoutEstimates)

import Dict exposing (Dict)


type alias PayoutRider comparable =
    { riderId : comparable
    , points : Int
    }


payoutEstimates : Float -> Int -> List (PayoutRider comparable) -> Dict comparable Float
payoutEstimates payoutPot minimumPayoutPoints riders =
    let
        eligibleRiders =
            List.filter (\rider -> rider.points >= minimumPayoutPoints) riders

        maxPayout =
            payoutPot * 0.2
    in
    if payoutPot <= 0 || List.isEmpty eligibleRiders then
        Dict.empty

    else
        distributePayouts maxPayout payoutPot eligibleRiders
            |> Dict.fromList


distributePayouts : Float -> Float -> List (PayoutRider comparable) -> List ( comparable, Float )
distributePayouts maxPayout potRemaining riders =
    let
        totalPoints =
            riders
                |> List.map .points
                |> List.sum
                |> toFloat
    in
    if potRemaining <= 0 || List.isEmpty riders || totalPoints <= 0 then
        []

    else
        let
            provisionalShare rider =
                potRemaining * toFloat rider.points / totalPoints

            cappedRiders =
                List.filter (\rider -> provisionalShare rider >= maxPayout) riders

            uncappedRiders =
                List.filter (\rider -> provisionalShare rider < maxPayout) riders
        in
        if List.isEmpty cappedRiders then
            List.map (\rider -> ( rider.riderId, provisionalShare rider )) riders

        else
            let
                cappedTotal =
                    toFloat (List.length cappedRiders) * maxPayout
            in
            List.map (\rider -> ( rider.riderId, maxPayout )) cappedRiders
                ++ distributePayouts maxPayout (potRemaining - cappedTotal) uncappedRiders
