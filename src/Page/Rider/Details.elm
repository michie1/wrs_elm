module Page.Rider.Details exposing (view)

import Html exposing (Html, a, div, text, table, tr, td, th, thead, tbody, ul, li, span, h2, p)
import Html.Attributes exposing (class, href)
import Date
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import App.Model
import App.Msg
import Data.Race exposing (Race)
import Data.Rider exposing (Rider)
import Data.RaceResult exposing (RaceResult, getPointsByResult, getPointsByResults)


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d" date


view : App.Model.App -> String -> List Race -> List Rider -> List RaceResult -> Html App.Msg.Msg
view _ riderKey races riders results =
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
                    riderResults =
                        List.filter
                            (\result -> result.riderKey == rider.key)
                            results

                    points =
                        getPointsByResults riderResults races
                in
                    div [ class "col s12" ]
                        [ h2 [] [ text rider.name ]
                        , info rider points
                        , resultsTable riderResults races
                        ]


info : Rider -> Int -> Html App.Msg.Msg
info rider points =
    div [ class "row" ]
        [ ul [ class "collection col s4 m5" ]
            [ li [ class "collection-item" ] [ text "Name ", span [ class "secondary-content" ] [ text rider.name ] ]
            , li [ class "collection-item" ] [ text "Licence ", span [ class "secondary-content" ] [ text (toString rider.licence) ] ]
            , li [ class "collection-item" ] [ text "Points ", span [ class "secondary-content" ] [ text <| toString points ] ]
            ]
        ]


resultsTable : List RaceResult -> List Race -> Html msg
resultsTable results races =
    table []
        [ thead []
            [ tr []
                [ th [] [ text "Race" ]
                , th [] [ text "Date" ]
                , th [] [ text "Points" ]
                , th [] [ text "Result" ]
                , th [] [ text "Outfit" ]
                ]
            ]
        , tbody []
            (results |> List.map (raceRow races))
        ]


raceRow : List Race -> RaceResult -> Html msg
raceRow races result =
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
                    dateString =
                        dateFormat race.date
                in
                    tr []
                        [ td []
                            [ a
                                [ href ("#races/" ++ race.key) ]
                                [ text race.name ]
                            ]
                        , td [] [ text <| dateString ]
                        , td [] [ text <| toString <| getPointsByResult result races ]
                        , td [] [ text result.result ]
                        , td [] [ text <| toString result.outfit ]
                        ]
