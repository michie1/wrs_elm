module Tests.Page.Rider.Add.Update exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)
import App.Model
import App.Page
import Page.Rider.Add.Update exposing (update)
import Page.Rider.Add.Msg as Msg exposing (Msg)
import Page.Rider.Add.Model exposing (Model)
import Data.Licence exposing (Licence(Elite, Amateurs))
import App.OutsideInfo exposing (sendInfoOutside)
import Json.Encode

suite : Test
suite =
    describe "Update"
        [ test "name" <|
            \_ ->
                let
                    before = Model "before" Nothing
                    ( nextPage, cmd ) =
                       update (Msg.Name "after") before
                in
                    Expect.equal nextPage.name "after"
        , test "licence" <|
            \_ ->
                let
                    before = Model "before" Nothing
                    ( nextPage, cmd ) =
                       update (Msg.Licence Elite) before
                in
                    Expect.equal nextPage.licence (Just Elite)
        , test "submit no licence" <|
            \_ ->
                let
                    before = Model "before" Nothing
                    ( nextPage, cmd ) =
                       update (Msg.Submit) before
                in
                    Expect.equal cmd Cmd.none
        , test "submit with licence" <|
            \_ ->
                let
                    before = Model "before" (Just Amateurs)
                    ( nextPage, cmd ) =
                        update (Msg.Submit) before
                    payload =
                        Json.Encode.object
                            [ ( "name", Json.Encode.string "before" )
                            , ( "licence", Json.Encode.string "amateurs" )
                            ]
                in
                    Expect.equal cmd (sendInfoOutside <| App.OutsideInfo.RiderAdd payload)
        ]
