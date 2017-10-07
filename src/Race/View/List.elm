module Race.View.List exposing (..)

import Race.Model exposing (Race, categoryString)
import Result.Model
import App.Msg
import Html exposing (Html, h2, div, text, a, table, tr, td, th, thead, tbody)
import Html.Attributes exposing (href, class)
import Date
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%d-%m-%Y" date


render : Bool -> List Race -> List Result.Model.Result -> Html App.Msg.Msg
render loggedIn races results =
    div []
        [ h2 [] [ text "Races" ]
        , addButton True
        , raceTable races results
        ]


addButton : Bool -> Html App.Msg.Msg
addButton loggedIn =
    case loggedIn of
        True ->
            div [] [ a [ href "#races/add", class "waves-effect waves-light btn" ] [ text "Add race" ] ]

        False ->
            div [] []


raceTable : List Race -> List Result.Model.Result -> Html App.Msg.Msg
raceTable races results =
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
                        dateString =
                            case race.date of
                                Just date ->
                                    dateFormat date

                                Nothing ->
                                    "1970-01-01"
                    in
                        tr []
                            [ td []
                                [ a
                                    [ href ("#races/" ++ race.key) ]
                                    [ text race.name ]
                                ]
                            , td [] [ text <| dateString ]
                            , td [] [ text (toString race.category) ]
                            , td [] [ text (toString (countParticipants race.key results)) ]
                            ]
                )
                races
            )
        ]


countParticipants : String -> List Result.Model.Result -> Int
countParticipants raceKey results =
    List.length
        (List.filter
            (\result -> result.raceKey == raceKey)
            results
        )
