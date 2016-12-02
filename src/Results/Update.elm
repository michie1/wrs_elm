module Results.Update
    exposing
        ( setResultAddRace
        , addResult
        , setRider
        )

import App.Model exposing (App)
import Results.Model exposing (ResultAdd)
import Riders.Model
import App.Msg exposing (Msg(..))
import Navigation


addResult : App -> ( Maybe Results.Model.Result, Cmd Msg )
addResult app =
    case app.resultAdd of
        Just resultAdd ->
            case (getRiderByName resultAdd.riderName app.riders) of
                Just rider ->
                    let
                        maybeStrava =
                            case resultAdd.strava of
                                "" ->
                                    Nothing

                                link ->
                                    Just link

                        result =
                            Results.Model.Result
                                (calcResultId app.results)
                                rider.id
                                resultAdd.raceId
                                resultAdd.result
                                resultAdd.category
                                maybeStrava
                    in
                        if resultExists result app.results then
                            ( Nothing, Debug.log "result already exists" Cmd.none )
                        else
                            ( Just result
                            , Navigation.newUrl ("#races/" ++ toString (Debug.log "raceId" result.raceId))
                            )

                Nothing ->
                    ( Nothing, Cmd.none )

        Nothing ->
            ( Nothing, Cmd.none )


getRiderByName : String -> List Riders.Model.Rider -> Maybe Riders.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)


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
    case app.resultAdd of
        Just resultAdd ->
            ( (set app (setRiderNameResultAdd resultAdd name))
            , Cmd.none
            )

        Nothing ->
            ( app, Cmd.none )


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


setResultAddRace : App -> Int -> ( App, Cmd Msg )
setResultAddRace app raceId =
    case app.resultAdd of
        Just resultAdd ->
            let
                resultAddWithRaceId =
                    { resultAdd | raceId = raceId }
            in
                ( { app | resultAdd = Just resultAddWithRaceId }
                , Cmd.none
                )

        Nothing ->
            ( app, Cmd.none )


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
