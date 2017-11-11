port module Page.Result.Add.Update exposing (update)

import Json.Encode
import Set
import Ui.Chooser
import Json.Decode
import App.Model exposing (App)
import App.Page
import App.UrlUpdate
import App.Helpers
import Page.Result.Add.Model exposing (Model)
import Page.Result.Add.Msg as ResultAdd
import Data.Outfit as Outfit exposing (Outfit, outfitToString)
import Data.RaceResult exposing (RaceResult, resultDecoder, resultsDecoder)
import Data.ResultCategory as ResultCategory exposing (ResultCategory, categoryToString)


port addResultPort : Json.Encode.Value -> Cmd msg


update : ResultAdd.Msg -> App -> ( App, Cmd ResultAdd.Msg )
update msg app =
    case msg of
        ResultAdd.ResultAddSubmit ->
            addSubmit app

        ResultAdd.ResultAddOutfit outfit ->
            addOutfit outfit app

        ResultAdd.ResultAddCategory category ->
            ( (case app.page of
                App.Page.ResultAdd resultAdd ->
                    { app
                        | page =
                            App.Page.ResultAdd <| addCategory category resultAdd
                    }

                _ ->
                    app
              )
            , Cmd.none
            )

        ResultAdd.ResultAddResult value ->
            addResult value app

        ResultAdd.Chooser msg_ ->
            case app.page of
                App.Page.ResultAdd resultAdd ->
                    let
                        ( chooser, cmd ) =
                            Ui.Chooser.update msg_ resultAdd.chooser

                        nextResultAdd =
                            App.Page.ResultAdd { resultAdd | chooser = chooser }
                    in
                        ( { app | page = nextResultAdd }
                        , Cmd.map ResultAdd.Chooser cmd
                        )

                _ ->
                    ( app, Cmd.none )


addCategory :
    ResultCategory
    -> Model
    -> Model
addCategory category resultAdd =
    { resultAdd | category = category }


addOutfit : Outfit -> App -> ( App, Cmd ResultAdd.Msg )
addOutfit outfit app =
    case app.page of
        App.Page.ResultAdd resultAdd ->
            let
                nextAdd =
                    { resultAdd | outfit = outfit }

                nextApp =
                    { app | page = App.Page.ResultAdd nextAdd }
            in
                ( nextApp, Cmd.none )

        _ ->
            ( app, Cmd.none )


addResult : String -> App -> ( App, Cmd ResultAdd.Msg )
addResult value app =
    case app.page of
        App.Page.ResultAdd raceKey ->
            ( { app | page = App.Page.ResultAdd raceKey }, Cmd.none )

        _ ->
            ( app, Cmd.none )


addSubmit : App -> ( App, Cmd ResultAdd.Msg )
addSubmit app =
    case app.page of
        App.Page.ResultAdd add ->
            let
                payload =
                    Json.Encode.object
                        [ ( "raceKey", Json.Encode.string add.raceKey )
                        , ( "riderKey", Json.Encode.string (riderKey add.chooser) )
                        , ( "result", Json.Encode.string add.result )
                        , ( "category", Json.Encode.string <| categoryToString add.category )
                        , ( "outfit", Json.Encode.string <| outfitToString add.outfit )
                        ]
            in
                ( app, addResultPort payload )

        _ ->
            ( app, Cmd.none )


riderKey : Ui.Chooser.Model -> String
riderKey chooser =
    chooser.selected
        |> Set.toList
        |> List.head
        |> Maybe.withDefault ""
