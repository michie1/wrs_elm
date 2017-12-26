module App.View exposing (view)

import Html exposing (Html, h2, div, text, a, ul, li, aside, p, section)
import Html.Attributes exposing (href, class, target)
import App.Msg
import App.Model exposing (App)
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
import Page.Result.Add.View


view : App -> Html App.Msg.Msg
view app =
    div [ class "container" ]
        [ loadingPage app
        ]


mainView : App -> List Race -> List Rider -> List RaceResult -> Html App.Msg.Msg
mainView app races riders results =
    div [ class "columns" ]
        [ section [ class "section", class "column", class "is-one-fifth" ] [ sidebar races ]
        , section [ class "section", class "column" ] [ viewPage app races riders results ]
        ]


viewPage : App -> List Race -> List Rider -> List RaceResult -> Html App.Msg.Msg
viewPage app races riders results =
    case app.page of
        App.Page.RiderDetails key ->
            Page.Rider.Details.view app key races riders results

        App.Page.Riders ->
            Page.Rider.List.view riders races results

        App.Page.RiderAdd add ->
            Page.Rider.Add.View.view add
                |> Html.map App.Msg.RiderAdd

        App.Page.RaceDetails key ->
            Page.Race.Details.view app key races riders results

        App.Page.Races ->
            Page.Race.List.view races results

        App.Page.RaceAdd raceAdd ->
            Page.Race.Add.View.view raceAdd
                |> Html.map App.Msg.RaceAdd

        App.Page.ResultAdd add ->
            let
                maybeRace =
                    getRace add.raceKey races
            in
                case maybeRace of
                    Just race ->
                        Page.Result.Add.View.view race add riders results
                            |> Html.map App.Msg.ResultAdd

                    Nothing ->
                        div [] [ text "Race does not exist." ]


loadingPage : App -> Html App.Msg.Msg
loadingPage app =
    case ( app.races, app.riders, app.results ) of
        ( Just races, Just riders, Just results ) ->
            mainView app races riders results

        ( _, _, _ ) ->
            div [ class "col s9 m8 offset-s3 offset-m4" ]
                [ h2 [ class "title is-2" ] [ text "Loading data" ]
                , spinner
                ]


spinner : Html App.Msg.Msg
spinner =
    div [ class "spinner" ]
        [ div [ class "bounce1" ] [ ]
        , div [ class "bounce2" ] [ ]
        , div [ class "bounce3" ] [ ]
        ]
    -- div [ class "loader" ] [ text "Loading..." ]

sidebar : List Race -> Html App.Msg.Msg
sidebar races =
    aside [ class "menu" ]
        [ p [ class "menu-label" ] [ a [ href "https://wtos.nl", target "_blank" ] [ text "WTOS.nl" ] ]
        , p [ class "menu-label" ] [ a [ href "#races" ] [ text "Races" ] ]
        , ul [ class "menu-list" ] (List.map raceLi <| lastRaces races)
        , p [ class "menu-label" ] [ a [ href "#riders" ] [ text "Riders" ] ]
        ]

raceLi : Race -> Html App.Msg.Msg
raceLi race =
    li [] [ a [ href ("#races/" ++ race.key) ] [ text race.name ] ]
