module Page.Rider.List exposing (view)

import App.Msg
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Data.Rider exposing (Rider, getPointsByRiderId)
import Html exposing (Html, a, div, h2, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (class, href, style)


view : List Rider -> List Race -> List RaceResult -> Html App.Msg.Msg
view riders races results =
    div []
        [ h2 [ class "title is-2" ] [ text "Riders" ]
        , addButton
        , table [ class "table" ]
            [ thead []
                [ tr []
                    [ th [] [ text "Name" ]
                    , th [] [ text "Licence" ]
                    , th [] [ text "Points" ]
                    ]
                ]
            , tbody []
                (riders
                    |> List.map (\rider -> { key = rider.key, name = rider.name, licence = rider.licence, points = getPointsByRiderId rider.key results races })
                    |> List.sortBy .points
                    |> List.reverse
                    |> List.map
                        (\rider ->
                            tr []
                                [ td []
                                    [ a [ href ("/riders/" ++ rider.key), style "display" "block" ]
                                        [ text rider.name ]
                                    ]
                                , td [] [ text (Debug.toString rider.licence) ]
                                , td [] [ text <| String.fromInt <| rider.points ]
                                ]
                        )
                )
            ]
        ]


addButton : Html App.Msg.Msg
addButton =
    a [ href "/riders/add", class "button" ] [ text "Add rider" ]
