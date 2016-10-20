module Results.Update exposing (setResultAddResult, setResultAddRider, setResultAddRace, addResult)

import App.Model exposing (App)
import Results.Model exposing (ResultAdd)
import App.Msg exposing (Msg(..))
import Navigation

addResult : App -> Results.Model.Result ->  ( App, Cmd Msg )
addResult app result =
    let
        newResult = setResultId result app.results
        newApp = setResultAdd app (clearResult app.resultAdd.result)
    in
        ( { newApp | 
                results = (List.append [ newResult ] app.results)
          }
        , Navigation.newUrl ("#results")
        )

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
        
setResultId : Results.Model.Result -> List Results.Model.Result -> Results.Model.Result
setResultId result results =
    let 
        id = calcResultId results
    in 
        { result | id = id }

