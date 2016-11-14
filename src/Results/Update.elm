module Results.Update exposing (setResultAddRider, setResultAddRace, addResult, setRider)

import App.Model exposing (App)
import Results.Model exposing (ResultAdd)
import Riders.Model
import App.Msg exposing (Msg(..))
import Navigation
import Util


addResult : App -> ( Maybe Results.Model.Result, Cmd Msg )
addResult app =
    let
        --resultAdd = Util.fromJust app.resultAdd
        resultAdd =
            case app.resultAdd of
                Nothing ->
                    Debug.crash "resultAdd shouldn't be Nothing when addResult is called."

                Just value ->
                    value

        -- result = resultAdd.result
        --riderId = Debug.log "riderId: " app.resultAdd.result.
        riderId =
            if resultAdd.riderId == 0 then
                (firstRiderId app.riders)
            else
                resultAdd.riderId

        result =
            Results.Model.Result
                (calcResultId app.results)
                riderId
                resultAdd.raceId
                resultAdd.result
    in
        if (Debug.log "new result rider id: " result.riderId) == 0 then
            ( Nothing, Cmd.none )
        else if resultExists result app.results then
            ( Nothing, Debug.log "result does not exists" Cmd.none )
        else
            ( Just result
            , Navigation.newUrl ("#races/" ++ toString (Debug.log "raceId" result.raceId))
            )


firstRiderId : List Riders.Model.Rider -> Int
firstRiderId riders =
    case (List.head riders) of
        Nothing ->
            0

        Just rider ->
            rider.id


resultExists : Results.Model.Result -> List Results.Model.Result -> Bool
resultExists result results =
    (List.length
        (List.filter
            (\r -> r.raceId == result.raceId && r.riderId == result.riderId)
            results
        )
    )
        /= 0


setRider : App -> String -> ( App, Cmd Msg )
setRider app name =
    let
        resultAdd =
            Util.fromJust app.resultAdd
    in
        ( (set app (setRiderNameResultAdd resultAdd name))
        , Cmd.none
        )


setRiderId : App -> Int -> App
setRiderId app riderId =
    let
        resultAdd =
            Util.fromJust app.resultAdd

        resultAddWithRiderId =
            { resultAdd | riderId = riderId }
    in
        --setResultAdd app ({ resultAdd | riderId = riderId })
        { app | resultAdd = Just resultAddWithRiderId }


getRiderId : List Riders.Model.Rider -> String -> Int
getRiderId riders name =
    let
        maybeRider =
            List.head
                (List.filter
                    (\rider -> rider.name == name)
                    riders
                )
    in
        case maybeRider of
            Just rider ->
                Debug.log "rider.id" rider.id

            Nothing ->
                0


setRiderNameResultAdd : ResultAdd -> String -> ResultAdd
setRiderNameResultAdd resultAdd name =
    { resultAdd | riderName = name }


set : App -> ResultAdd -> App
set app resultAdd =
    { app | resultAdd = Just resultAdd }


setResultAddRider : App -> Int -> ( App, Cmd Msg )
setResultAddRider app riderId =
    let
        resultAdd =
            Util.fromJust app.resultAdd

        resultAddWithRiderId =
            { resultAdd | riderId = riderId }
    in
        --( setResultAdd app (setResultRider resultAdd newId)
        ( { app | resultAdd = Just resultAddWithRiderId }
        , Cmd.none
        )


setResultAddRace : App -> Int -> ( App, Cmd Msg )
setResultAddRace app raceId =
    let
        resultAdd =
            Util.fromJust app.resultAdd

        resultAddWithRaceId =
            { resultAdd | raceId = raceId }
    in
        --( setResultAdd app (setResultRace resultAdd raceId)
        ( { app | resultAdd = Just resultAddWithRaceId }
        , Cmd.none
        )


setResultResult : Results.Model.Result -> String -> Results.Model.Result
setResultResult result value =
    { result | result = value }


setResultRider : Results.Model.Result -> Int -> Results.Model.Result
setResultRider result rider =
    { result | riderId = rider }


setResultRace : Results.Model.Result -> Int -> Results.Model.Result
setResultRace result rider =
    { result | raceId = rider }


clearResult : Results.Model.Result -> Results.Model.Result
clearResult result =
    setResultResult result ""


calcResultId : List Results.Model.Result -> Int
calcResultId results =
    (List.length results) + 1
