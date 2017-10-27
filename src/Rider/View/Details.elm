module Rider.View.Details exposing (render)

import App.Model
import Rider.Model exposing (Rider)
import App.Msg
import App.Model
import Html exposing (Html, a, div, text, table, tr, td, th, thead, tbody, ul, li, span, h2, p)
import Html.Attributes exposing (class, href)
import Result.Model
import Race.Model
import Date
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import App.Helpers
import Date.Extra


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d" date


render : App.Model.App -> String -> Html App.Msg.Msg
render app riderKey =
    case app.riders of
        Just riders ->
            case app.races of
                Just races ->
                    let
                        maybeRider =
                            List.head
                                (List.filter
                                    (\rider -> rider.key == riderKey)
                                    riders
                                )
                    in
                        case maybeRider of
                            Nothing ->
                                div []
                                    [ h2 [] [ text "Rider" ]
                                    , p [] [ text "Rider does not exist." ]
                                    ]

                            Just rider ->
                                let
                                    results =
                                        List.filter
                                            (\result -> result.riderKey == rider.key)
                                            (Maybe.withDefault [] app.results)

                                    points = App.Helpers.getPointsByResults results races
                                in
                                    div [ class "col s12" ]
                                        [ h2 [] [ text rider.name ]
                                        , info rider points
                                        , resultsTable rider results (Maybe.withDefault [] app.races)
                                        ]
                Nothing ->
                    div [] [ text "No races loaded." ]

        Nothing ->
            div [] [ text "No riders loaded." ]



info : Rider -> Int -> Html App.Msg.Msg
info rider points =
    div [ class "row" ]
        [ ul [ class "collection col s4 m5" ]
            [ li [ class "collection-item" ] [ text "Name ", span [ class "secondary-content" ] [ text rider.name ] ]
            , li [ class "collection-item" ] [ text "Licence ", span [ class "secondary-content" ] [ text (toString rider.licence) ] ]
            , li [ class "collection-item" ] [ text "Points ", span [ class "secondary-content" ] [ text <| toString points ] ]
            ]
        ]


resultsTable : Rider -> List Result.Model.Result -> List Race.Model.Race -> Html msg
resultsTable rider results races =
    table []
        [ thead []
            [ tr []
                [ th [] [ text "Race" ]
                , th [] [ text "Date" ]
                , th [] [ text "Points" ]
                , th [] [ text "Result" ]
                ]
            ]
        , tbody []
            (results
                -- |> List.sortWith (\a b -> Date.Extra.compare a.race.date b.date) -- TODO: sort by race date of this result
                |> List.map
                    (\result ->
                        raceRow result races
                    )
            )
        ]


raceRow : Result.Model.Result -> List Race.Model.Race -> Html msg
raceRow result races =
    let
        maybeRace =
            List.head
                (List.filter
                    (\race -> race.key == result.raceKey)
                    races
                )
    in
        case maybeRace of
            Nothing ->
                tr []
                    [ td [] [ text "RaceId does not exist" ]
                    ]

            Just race ->
                let
                    dateString = dateFormat race.date
                in
                    tr []
                        [ td []
                            [ a
                                [ href ("#races/" ++ race.key) ]
                                [ text race.name ]
                            ]
                        , td [] [ text <| dateString ]
                        , td [] [ text <| toString <| App.Helpers.getPointsByResult result races ]
                        , td [] [ text result.result ]
                        ]
