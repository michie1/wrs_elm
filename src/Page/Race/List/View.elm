module Page.Race.List.View exposing (..)

import Html exposing (Html, h2, div, text, a, table, tr, td, th, thead, tbody)
import Html.Attributes exposing (href, class)
import Date
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import Date.Extra
import App.Msg
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Page.Result.Model


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%d-%m-%Y" date


render : Maybe (List Race) -> Maybe (List RaceResult) -> Html App.Msg.Msg
render maybeRaces maybeResults =
    div []
        [ h2 [] [ text "Races" ]
        , addButton
        , raceTable (Maybe.withDefault [] maybeRaces) (Maybe.withDefault [] maybeResults)
        ]


addButton : Html App.Msg.Msg
addButton =
    div [] [ a [ href "#races/add", class "waves-effect waves-light btn" ] [ text "Add race" ] ]


raceTable : List Race -> List RaceResult -> Html App.Msg.Msg
raceTable unsortedRaces results =
    let
        races = unsortedRaces |> List.sortWith (\a b -> Date.Extra.compare a.date b.date) |> List.reverse
    in
        table []
            [ thead []
                [ tr []
                    [ th [] [ text "Name" ]
                    , th [] [ text "Date" ]
                    , th [] [ text "Category" ]
                    , th [] [ text "Riders" ]
                    ]
                ]
            , tbody []
                (List.map
                    (\race ->
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
                                , td [] [ text (toString race.raceType) ]
                                , td [] [ text (toString (countParticipants race.key results)) ]
                                ]
                    )
                    races
                )
            ]


countParticipants : String -> List RaceResult -> Int
countParticipants raceKey results =
    List.length
        (List.filter
            (\result -> result.raceKey == raceKey)
            results
        )