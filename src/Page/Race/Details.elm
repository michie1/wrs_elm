module Page.Race.Details exposing (view)

import Html exposing (Html, button, span, h2, h3, h5, ul, li, a, div, text, table, tbody, thead, tr, td, th)
import Html.Attributes exposing (href, class, style)
import Html.Events exposing (onClick)
import Date
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import App.Model
import App.Msg
import App.Page
import Data.Race exposing (Race)
import Data.Rider exposing (Rider)
import Data.RaceResult exposing (RaceResult)
import Data.ResultCategory exposing (ResultCategory, resultCategories)
import Data.RaceType exposing (getPointsByRaceType)
import Page.Result.Add.Model as ResultAdd


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d" date


view : App.Model.App -> String -> List Race -> List Rider -> List RaceResult -> Html App.Msg.Msg
view _ raceKey races riders results =
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
                    raceResults =
                        List.filter
                            (\result -> result.raceKey == race.key)
                            results
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
                        , resultsTable raceResults riders
                        ]


addResultButton : Race -> Html App.Msg.Msg
addResultButton race =
    let
        initialAdd =
            ResultAdd.initial

        resultAdd =
            { initialAdd | raceKey = race.key }
    in
        button
            [ class "waves-effect waves-light btn"
            , onClick (App.Msg.Navigate (App.Page.ResultAdd resultAdd))
            , Html.Attributes.name "action"
            ]
            [ text "Add result" ]


info : Race -> Html App.Msg.Msg
info race =
    let
        dateString =
            dateFormat race.date
    in
        div [ class "row" ]
            [ div [ class "col s4 m5" ]
                [ ul [ class "collection" ]
                    [ infoLi "Name " race.name
                    , infoLi "Date " dateString
                    , infoLi "Category " (toString race.raceType)
                    , infoLi "Points " (toString <| getPointsByRaceType race.raceType)
                    ]
                ]
            ]


infoLi : String -> String -> Html App.Msg.Msg
infoLi label spanText =
    li [ class "collection-item" ] [ text label, span [ class "secondary-content" ] [ text spanText ] ]


resultsTable : List RaceResult -> List Rider -> Html msg
resultsTable results riders =
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
                            [ href ("#riders/" ++ rider.key), style [ ( "display", "block" ) ] ]
                            [ text rider.name ]
                        ]
                    , resultTd result.result
                    ]


resultTd : String -> Html msg
resultTd result =
    td []
        [ span [] [ text result ]
        ]
