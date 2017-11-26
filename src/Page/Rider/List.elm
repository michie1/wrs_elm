module Page.Rider.List exposing (view)

import Html exposing (Html, h2, a, div, text, table, td, tr, th, thead, tbody)
import Html.Attributes exposing (href, class, style)
import App.Msg
import Data.Race exposing (Race)
import Data.Rider exposing (Rider, getPointsByRiderId)
import Data.RaceResult exposing (RaceResult)


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
                      --, th [] [ text "Races" ]
                    ]
                ]
            , tbody []
                (List.map
                    (\rider ->
                        tr []
                            [ td []
                                [ a [ href ("#riders/" ++ rider.key), style [ ( "display", "block" ) ] ]
                                    [ text rider.name ]
                                ]
                            , td [] [ text (toString rider.licence) ]
                            , td [] [ text <| toString <| getPointsByRiderId rider.key results races ]
                              --, td [] [ text <| toString <| countResultsByRiderId rider.id results ]
                              --, td [] [ text "points" ]
                              --, td [] [ text "races" ]
                            ]
                    )
                    riders
                )
            ]
        ]


addButton : Html App.Msg.Msg
addButton =
    a [ href "#riders/add", class "button" ] [ text "Add rider" ]
