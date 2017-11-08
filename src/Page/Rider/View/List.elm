module Page.Rider.View.List exposing (render)

import Html exposing (Html, h2, a, div, text, span, input, ul, li, table, td, tr, th, thead, tbody)
import Html.Attributes exposing (href, class)
import App.Model
import App.Msg
import App.Routing
import App.Helpers
import Data.Rider exposing (Rider)
import Data.RaceResult exposing (RaceResult)
import Page.Result.Add.Model as ResultAdd
import Page.Race.Add.Model as RaceAdd

render : List Rider -> Html App.Msg.Msg
render riders =
    div []
        [ h2 [] [ text "Riders" ]
        , addButton
        , table []
            [ thead []
                [ tr []
                    [ th [] [ text "Name" ]
                    , th [] [ text "Licence" ]
                    --, th [] [ text "Points" ]
                    --, th [] [ text "Races" ]
                    ]
                ]
            , tbody []
                (List.map
                    (\rider ->
                        tr []
                            [ td []
                                [ a [ href ("#riders/" ++ rider.key) ]
                                    [ text rider.name ]
                                ]
                            , td [] [ text (toString rider.licence) ]
                            --, td [] [ text <| toString <| App.Helpers.getPointsByRiderId rider.id results races ]
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
    div [] [ a [ href "#riders/add", class "waves-effect waves-light btn" ] [ text "Add rider" ] ]

countResultsByRiderId : String -> List RaceResult -> Int
countResultsByRiderId riderKey results =
    List.length <|
        List.filter
            (\result -> result.riderKey == riderKey)
            results
