module Page.Race.Details exposing (view)

import App.Helpers exposing (formatDate)
import App.Model
import App.Msg
import App.Page
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Data.RaceType exposing (getPointsByRaceType, raceTypeReadable)
import Data.ResultCategory exposing (ResultCategory, categoryReadable, resultCategories)
import Data.Rider exposing (Rider)
import Html exposing (Html, a, button, dd, div, dl, dt, h2, h3, h5, i, span, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (class, href, style)
import Html.Events exposing (onClick)
import Page.Result.Add.Model as ResultAdd


view : App.Model.App -> String -> List Race -> List Rider -> List RaceResult -> Html App.Msg.Msg
view app raceKey races riders results =
    let
        maybeRace =
            List.head
                (List.filter
                    (\race -> race.key == raceKey)
                    races
                )

        signedIn =
            app.user /= Nothing
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
                    [ h2 [ class "title is-2" ] [ text race.name ]
                    , info race
                    ]
                , div []
                    [ h3 [ class "title is-3" ] [ text "Results" ]
                    , addResultButton race
                    ]
                , resultsTable raceResults riders signedIn
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
        [ class "button"
        , onClick (App.Msg.Navigate (App.Page.ResultAdd resultAdd))
        ]
        [ text "Add result" ]


info : Race -> Html App.Msg.Msg
info race =
    let
        dateString =
            formatDate race.date
    in
    div [ class "card" ]
        [ div [ class "card-content" ]
            [ div [ class "content" ]
                [ dl []
                    [ dt [] [ text "Name" ]
                    , dd [] [ text race.name ]
                    , dt [] [ text "Date" ]
                    , dd [] [ text dateString ]
                    , dt [] [ text "Category" ]
                    , dd [] [ text <| raceTypeReadable race.raceType ]
                    , dt [] [ text "Points" ]
                    , dd [] [ text <| String.fromInt <| getPointsByRaceType race.raceType ]
                    ]
                ]
            ]
        ]


resultsTable : List RaceResult -> List Rider -> Bool -> Html msg
resultsTable results riders signedIn =
    div [] <|
        List.map
            (\category -> resultsByCategory category results riders signedIn)
            resultCategories


resultToInt : RaceResult -> RaceResult -> Order
resultToInt a b =
    let
        aNumber =
            String.toInt a.result

        bNumber =
            String.toInt b.result
    in
    case Maybe.map2 compare aNumber bNumber of
        Just orderFromInts ->
            orderFromInts

        Nothing ->
            compare (String.toLower a.result) (String.toLower b.result)


resultsByCategory : ResultCategory -> List RaceResult -> List Rider -> Bool -> Html msg
resultsByCategory category results riders signedIn =
    let
        catResults =
            results
                |> List.filter (\result -> result.category == category)
                |> List.sortWith resultToInt
    in
    case List.length catResults of
        0 ->
            div [] []

        _ ->
            div []
                [ h5 [ class "title is-5" ] [ text <| categoryReadable category ]
                , div [ class "table-container" ]
                    [ table [ class "table" ]
                        [ thead []
                            [ tr []
                                [ th [] [ text "Rider" ]
                                , th [] [ text "Result" ]
                                , if signedIn then
                                    th [] [ text "Edit" ]

                                  else
                                    text ""
                                ]
                            ]
                        , tbody [] <|
                            List.map (\result -> resultRow result riders signedIn) catResults
                        ]
                    ]
                ]


resultRow : RaceResult -> List Rider -> Bool -> Html msg
resultRow result riders signedIn =
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
                        [ href ("/riders/" ++ rider.key), style "display" "block" ]
                        [ text rider.name ]
                    ]
                , resultTd result.result
                , if signedIn then
                    td []
                        [ a [ href ("/results/" ++ result.key ++ "/edit"), style "display" "block" ]
                            [ span [ class "icon" ] [ i [ class "fas fa-pencil-alt" ] [ text "" ] ] ]
                        ]

                  else
                    text ""
                ]


resultTd : String -> Html msg
resultTd result =
    td []
        [ span [] [ text result ]
        ]
