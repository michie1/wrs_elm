module Page.Race.View.Details exposing (..)

import Html exposing (Html, img, button, span, li, i, h2, h3, h5, ul, li, a, div, text, table, tbody, thead, tr, td, th, br, p)
import Html.Attributes exposing (target, src, href, class, style)
import Html.Events exposing (onClick, onInput)
import List.Extra
import Date
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import App.Model
import App.Msg
import App.Page
import App.Routing
import App.Helpers
import Data.Race exposing (Race)
import Data.Rider exposing (Rider)
import Data.RaceResult exposing (RaceResult)
import Data.ResultCategory exposing (ResultCategory, resultCategories)
import Page.Rider.Model
import Page.Result.Model


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d" date


render : App.Model.App -> String -> Html App.Msg.Msg
render app raceKey =
    case ( app.races, app.riders ) of
        ( Nothing, Nothing ) ->
            div [] [ text "Races and riders not loaded." ]

        ( Nothing, _ ) ->
            div [] [ text "Races not loaded." ]

        ( _, Nothing ) ->
            div [] [ text "Riders not loaded." ]

        ( Just races, Just riders ) ->
            let
                maybeRace =
                    List.head
                        (List.filter
                            (\race -> race.key == raceKey)
                            races
                        )
            in
                case maybeRace of
                    Nothing ->
                        div [] [ text "Race does not exist" ]

                    Just race ->
                        let
                            results =
                                List.filter
                                    (\result -> result.raceKey == race.key)
                                    (Maybe.withDefault [] app.results)
                        in
                            div []
                                [ div []
                                    [ h2 [] [ text race.name ]
                                    , info race
                                    ]
                                , div []
                                    [ h3 [] [ text "Results" ]
                                    , addResultButton race
                                    ]
                                , resultsTable race results riders
                                ]


addResultButton : Race -> Html App.Msg.Msg
addResultButton race =
    let
        initialAdd = Page.Result.Model.initialAdd
        resultAdd = { initialAdd | raceKey = race.key }
    in
        button
            [ class "waves-effect waves-light btn"
            , onClick (App.Msg.NavigateTo (App.Page.ResultAdd resultAdd))
            , Html.Attributes.name "action"
            ]
            [ text "Add result" ]


info : Race -> Html App.Msg.Msg
info race =
    let
        dateString = dateFormat race.date
    in
        div [ class "row" ]
            [ div [ class "col s4 m5" ]
                [ ul [ class "collection" ]
                    [ li [ class "collection-item" ] [ text "Name ", span [ class "secondary-content" ] [ text race.name ] ]
                    , li [ class "collection-item" ] [ text "Date ", span [ class "secondary-content" ] [ text dateString ] ]
                    , li [ class "collection-item" ] [ text "Category ", span [ class "secondary-content" ] [ text (toString race.raceType) ] ]
                    , li [ class "collection-item" ] [ text "Points ", span [ class "secondary-content" ] [ text <| toString <| App.Helpers.getPointsByRaceType race.raceType ] ]
                    ]
                ]
            ]


resultsTable : Race -> List RaceResult -> List Rider -> Html msg
resultsTable race results riders =
    div [] <|
        List.map
            (\category -> resultsByCategory category results riders)
            resultCategories


resultsByCategory : ResultCategory -> List RaceResult -> List Rider -> Html msg
resultsByCategory category results riders =
    let
        catResults =
            List.sortBy
                .result
            <|
                List.filter
                    (\result -> result.category == category)
                    results
    in
        case List.length catResults of
            0 ->
                div [] []

            _ ->
                div []
                    [ h5 [] [ text (toString category) ]
                    , table []
                        [ thead []
                            [ tr []
                                [ th [] [ text "Rider" ]
                                , th [] [ text "Result" ]
                                ]
                            ]
                        , tbody [] <|
                            List.map (\result -> resultRow result riders) catResults
                        ]
                    ]


resultRow : RaceResult -> List Rider -> Html msg
resultRow result riders =
    let
        maybeRider =
            List.head
                (List.filter
                    (\rider -> rider.key == result.riderKey)
                    riders
                )
    in
        case maybeRider of
            Nothing ->
                tr []
                    [ td [] [ text "RiderId does not exist" ]
                    ]

            Just rider ->
                tr []
                    [ td []
                        [ a
                            [ href ("#riders/" ++ rider.key) ]
                            [ text rider.name ]
                        ]
                    , resultTd result.result
                    ]


resultTd : String -> Html msg
resultTd result =
    td []
        [ span [] [ text result ]
        ]


getRiderById : String -> List Rider -> Maybe Rider
getRiderById key riders =
    List.head
        (List.filter
            (\rider -> rider.key == key)
            riders
        )
