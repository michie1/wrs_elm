module Page.Race.List exposing (view)

import App.Helpers exposing (formatDate)
import App.Msg
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Html exposing (Html, a, div, h2, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (class, href, style)


view : List Race -> List RaceResult -> Html App.Msg.Msg
view races results =
    div []
        [ h2 [ class "title is-2" ] [ text "Races" ]
        , addButton
        , raceTable races results
        ]


addButton : Html App.Msg.Msg
addButton =
    a [ href "#races/add", class "button" ] [ text "Add race" ]


raceTable : List Race -> List RaceResult -> Html App.Msg.Msg
raceTable unsortedRaces results =
    let
        races =
            unsortedRaces

        -- TODO: sort race |> List.sortWith (\ra rb -> Date.Extra.compare ra.date rb.date) |> List.reverse
    in
    table [ class "table" ]
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
                        dateString =
                            formatDate race.date
                    in
                    tr []
                        [ td []
                            [ a
                                [ href ("#races/" ++ race.key), style "display" "block" ]
                                [ text race.name ]
                            ]
                        , td [] [ text <| dateString ]
                        , td [] [ text (Debug.toString race.raceType) ]
                        , td [] [ text (String.fromInt (countParticipants race.key results)) ]
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
