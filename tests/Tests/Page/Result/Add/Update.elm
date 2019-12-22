module Tests.Page.Result.Add.Update exposing (..)

import App.Model
import App.OutsideInfo exposing (sendInfoOutside)
import App.Page
import Data.Outfit exposing (Outfit(..))
import Data.ResultCategory exposing (ResultCategory(..))
import Expect exposing (Expectation)
import Json.Encode
import Page.Result.Add.Model exposing (Model)
import Page.Result.Add.Msg as Msg exposing (Msg)
import Page.Result.Add.Update exposing (update)
import Test exposing (..)


suite : Test
suite =
    describe "Update"
        [ test "result" <|
            \_ ->
                let
                    before =
                        Model "raceKey" Nothing "before" Elite WTOS ""

                    ( nextPage, cmd ) =
                        update (Msg.Result "after") before
                in
                Expect.equal nextPage.result "after"
        , test "Outfit" <|
            \_ ->
                let
                    before =
                        Model "raceKey" Nothing "before" Elite WTOS ""

                    ( nextPage, cmd ) =
                        update (Msg.Outfit WASP) before
                in
                Expect.equal nextPage.outfit WASP
        , test "Category" <|
            \_ ->
                let
                    before =
                        Model "raceKey" Nothing "before" Elite WTOS ""

                    ( nextPage, cmd ) =
                        update (Msg.Category Amateurs) before
                in
                Expect.equal nextPage.category Amateurs
        , test "submit no rider" <|
            \_ ->
                let
                    before =
                        Model "raceKey" Nothing "before" Elite WTOS ""

                    ( nextPage, cmd ) =
                        update Msg.Submit before
                in
                Expect.equal cmd Cmd.none
        , test "submit with rider" <|
            \_ ->
                let
                    before =
                        Model "raceKey" (Just "riderKey") "before" Elite WTOS ""

                    ( nextPage, cmd ) =
                        update Msg.Submit before

                    payload =
                        Json.Encode.object
                            [ ( "raceKey", Json.Encode.string "raceKey" )
                            , ( "riderKey", Json.Encode.string "riderKey" )
                            , ( "result", Json.Encode.string "before" )
                            , ( "category", Json.Encode.string "elite" )
                            , ( "outfit", Json.Encode.string "wtos" )
                            ]
                in
                Expect.equal cmd (sendInfoOutside <| App.OutsideInfo.ResultAdd payload)
        ]
