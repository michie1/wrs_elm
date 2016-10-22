module Results.Update exposing (setResultAddResult, setResultAddRider, setResultAddRace, addResult, setRider)

import App.Model exposing (App)
import Results.Model exposing (ResultAdd)
import Riders.Model

import App.Msg exposing (Msg(..))
import Navigation

addResult : App ->  ( App, Cmd Msg )
addResult app =
    let
        result = app.resultAdd.result

        newResult = 
            { result | id = (calcResultId app.results)
                     , riderId = ( getRiderId app.riders app.resultAdd.riderName )
            }

        newResults = newResult :: app.results

    in
        if newResult.riderId == 0 then
            ( app, Cmd.none )
        else if resultExists newResult app.results then
            ( app, Cmd.none )
        else 
            ( { app | results = newResults 
                    , resultAdd = Debug.log "Empty resultAdd" Results.Model.empty
              }
            , Navigation.newUrl ("#races/" ++ toString newResult.raceId)
            )

resultExists : Results.Model.Result -> List Results.Model.Result -> Bool
resultExists result results =
    ( List.length
        ( List.filter 
            (\r -> r.raceId == result.raceId && r.riderId == result.riderId)
            results
        )
    ) /= 0

setRider : App -> String -> ( App, Cmd Msg )
setRider app name =
    ( ( set app ( setRiderNameResultAdd app.resultAdd name ) ) 
    , Cmd.none
    )

setRiderId : App -> Int -> App
setRiderId app riderId =
    setResultAdd app ( setResultRider app.resultAdd.result riderId )

getRiderId : List Riders.Model.Rider -> String -> Int
getRiderId riders name =
    let 
        maybeRider = List.head
            ( List.filter 
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
    { app | resultAdd = resultAdd }


setResultAddResult : App -> String -> ( App, Cmd Msg )
setResultAddResult app value =
    ( setResultAdd app ( setResultResult app.resultAdd.result value )
    , Cmd.none
    )

setResultAddRider : App -> Int -> ( App, Cmd Msg )
setResultAddRider app newId =
    ( setResultAdd app ( setResultRider app.resultAdd.result newId )
    , Cmd.none
    )

setResultAddRace : App -> Int -> ( App, Cmd Msg )
setResultAddRace app newId =
    ( setResultAdd app ( setResultRace app.resultAdd.result newId )
    , Cmd.none
    )

setResultAdd : App -> Results.Model.Result -> App
setResultAdd app newResult =
    { app | 
        resultAdd = (setResult app.resultAdd newResult) 
    }

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

setResult : ResultAdd -> Results.Model.Result -> ResultAdd
setResult resultAdd result =
    { resultAdd | result = result }

calcResultId : List Results.Model.Result -> Int
calcResultId results = 
    ( List.length results ) + 1
        
