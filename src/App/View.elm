module App.View exposing (render)

import Html exposing (Html, h2, h3, h4, button, nav, div, text, span, a, input, ul, li, node)
import Html.Attributes exposing (attribute, href, id, class)
import Html.Events exposing (onInput, onClick)
import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import App.Routing
import App.Page
import Data.Race exposing (Race, lastRaces, getRace)
import Page.Race.View.Add
import Page.Race.View.List
import Page.Race.View.Details
import Page.Rider.View.List
import Page.Rider.View.Details
import Page.Result.View.List
import Page.Result.View.Add
import Page.Rider.View.Add
import Date.Extra


render : App -> Html Msg
render app =
    div [ class "container" ]
        [ div [ class "row" ] [ loadingPage app ]
        ]


mainView : App -> Html Msg
mainView app =
    div []
        [ div [ class "col s3 m4" ] [ sidebar app ]
        , div [ class "col s9 m8" ] [ viewPage app ]
        ]


sidebar : App -> Html Msg
sidebar app =
    div []
        [ h2 [] [ text "WRS" ]
        , ul [ class "collection" ] <|
            [ li [ class "collection-header" ] [ h4 [] [ a [ href "#riders" ] [ text "Riders" ] ] ] ]
                ++ [ li [ class "collection-header" ] [ h4 [] [ a [ href "#races" ] [ text "Races" ] ] ] ]
                ++ (List.map raceLi <| lastRaces app.races)
        ]


viewPage : App -> Html Msg
viewPage app =
    case app.page of
        App.Page.Riders ->
            case app.riders of
                Just riders ->
                    Page.Rider.View.List.render riders

                Nothing ->
                    div [] [ text "No riders loaded." ]

        App.Page.RiderDetails key ->
            Page.Rider.View.Details.render app key

        App.Page.RiderAdd add ->
            Page.Rider.View.Add.render add

        App.Page.Races ->
            Page.Race.View.List.render app.races app.results

        App.Page.RaceDetails key ->
            Page.Race.View.Details.render app key

        App.Page.RaceAdd raceAdd ->
            Page.Race.View.Add.render raceAdd

        App.Page.ResultAdd add ->
            let
                maybeRace =
                    getRace add.raceKey (Maybe.withDefault [] app.races)
            in
                case ( maybeRace, app.riders ) of
                    ( Nothing, Nothing ) ->
                        div [] [ text "Race does not exist and riders not loaded." ]

                    ( Nothing, _ ) ->
                        div [] [ text "Race does not exist." ]

                    ( _, Nothing ) ->
                        div [] [ text "Riders not yet loaded." ]

                    ( Just race, Just riders ) ->
                        Page.Result.View.Add.render race add riders app.results


loadingPage : App -> Html Msg
loadingPage app =
    case ( app.races, app.riders ) of
        ( Just race, Just riders ) ->
            mainView app

        ( _, _ ) ->
            div [ class "col s9 m8 offset-s3 offset-m4" ]
                [ h2 [] [ text "Loading data" ]
                , spinner
                ]


spinner : Html Msg
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


userLi : App -> List (Html App.Msg.Msg)
userLi app =
    [ li [] [ a [ href "#races" ] [ text "Races" ] ]
    , li [] [ a [ href "#riders" ] [ text "Riders" ] ]
    ]


raceLi : Race -> Html Msg
raceLi race =
    li [] [ a [ class "collection-item", href ("#races/" ++ race.key) ] [ text race.name ] ]
