module App.View exposing (view)

import Html exposing (Html, h2, h3, h4, button, nav, div, text, span, a, input, ul, li, node)
import Html.Attributes exposing (attribute, href, id, class)
import Html.Events exposing (onInput, onClick)
import Date.Extra
import App.Msg
import App.Model exposing (App)
import App.Routing
import App.Page
import Data.Race exposing (Race, lastRaces, getRace)
import Data.Rider exposing (Rider)
import Data.RaceResult exposing (RaceResult)
import Page.Race.Details
import Page.Race.List
import Page.Race.Add.View
import Page.Rider.Details
import Page.Rider.List
import Page.Rider.Add.View
import Page.Result.List
import Page.Result.Add.View
import Page.Result.Add.Msg


view : App -> Html App.Msg.Msg
view app =
    div [ class "container" ]
        [ div [ class "row" ] [ loadingPage app ]
        ]


mainView : App -> List Race -> List Rider -> List RaceResult -> Html App.Msg.Msg
mainView app races riders results =
    div []
        [ div [ class "col s3 m4" ] [ sidebar races ]
        , div [ class "col s9 m8" ] [ viewPage app races riders results ]
        ]


viewPage : App -> List Race -> List Rider -> List RaceResult -> Html App.Msg.Msg
viewPage app races riders results =
    case app.page of
        App.Page.RiderDetails key ->
            Page.Rider.Details.view app key races riders results

        App.Page.Riders ->
            Page.Rider.List.view riders

        App.Page.RiderAdd add ->
            Page.Rider.Add.View.view add
                |> Html.map App.Msg.RiderAddMsg

        App.Page.RaceDetails key ->
            Page.Race.Details.view app key races riders results

        App.Page.Races ->
            Page.Race.List.view races results

        App.Page.RaceAdd raceAdd ->
            Page.Race.Add.View.view raceAdd

        App.Page.ResultAdd add ->
            let
                maybeRace =
                    getRace add.raceKey races
            in
                case maybeRace of
                    Just race ->
                        Page.Result.Add.View.view race add riders results
                            |> Html.map App.Msg.ResultAddMsg

                    Nothing ->
                        div [] [ text "Race does not exist." ]


loadingPage : App -> Html App.Msg.Msg
loadingPage app =
    case ( app.races, app.riders, app.results ) of
        ( Just races, Just riders, Just results ) ->
            mainView app races riders results

        ( _, _, _ ) ->
            div [ class "col s9 m8 offset-s3 offset-m4" ]
                [ h2 [] [ text "Loading data" ]
                , spinner
                ]


spinner : Html App.Msg.Msg
spinner =
    div [ class "preloader-wrapper big active" ]
        [ div [ class "spinner-layer spinner-blue-only" ]
            [ div [ class "circle-clipper left" ]
                [ div [ class "circle" ] []
                , div [ class "gap-patch" ] []
                , div [ class "circle" ] []
                ]
            , div [ class "circle-clipper right" ] []
            , div [ class "circle" ] []
            ]
        ]


sidebar : List Race -> Html App.Msg.Msg
sidebar races =
    div []
        [ h2 [] [ text "WRS" ]
        , ul [ class "collection" ] <|
            [ li [ class "collection-header" ] [ h4 [] [ a [ href "#riders" ] [ text "Riders" ] ] ] ]
                ++ [ li [ class "collection-header" ] [ h4 [] [ a [ href "#races" ] [ text "Races" ] ] ] ]
                ++ (List.map raceLi <| lastRaces races)
        ]


userLi : App -> List (Html App.Msg.Msg)
userLi app =
    [ li [] [ a [ href "#races" ] [ text "Races" ] ]
    , li [] [ a [ href "#riders" ] [ text "Riders" ] ]
    ]


raceLi : Race -> Html App.Msg.Msg
raceLi race =
    li [] [ a [ class "collection-item", href ("#races/" ++ race.key) ] [ text race.name ] ]
