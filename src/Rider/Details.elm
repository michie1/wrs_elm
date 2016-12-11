module Rider.Details exposing (..)

import App.Model
import Rider.Model exposing (Rider)
import App.Msg
import App.Model
import Html exposing (Html, a, div, text, table, tr, td, th, thead, tbody, ul, li, span, h2, p)
import Html.Attributes exposing (class, href)
import Results.Model
import Race.Model


render : App.Model.App -> Int -> Html App.Msg.Msg
render app riderId =
    case app.riders of 
        Just riders ->
            let
                maybeRider =
                    List.head
                        (List.filter
                            (\rider -> rider.id == riderId)
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
                                    (\result -> result.riderId == rider.id)
                                    app.results
                        in
                            div []
                                [ h2 [] [ text rider.name ]
                                , info rider
                                , resultsTable rider results app.races
                                ]
        Nothing ->
            div [] [ text "No riders loaded." ]

info : Rider -> Html App.Msg.Msg
info rider =
    div [ class "row" ]
        [ div [ class "col s4" ]
            [ ul [ class "collection" ]
                [ li [ class "collection-item" ] [ text "Name ", span [ class "secondary-content" ] [ text rider.name ] ]
                , li [ class "collection-item" ] [ text "Licence ", span [ class "secondary-content" ] [ text (toString rider.licence) ] ]
                , li [ class "collection-item" ] [ text "Points ", span [ class "secondary-content" ] [ text rider.name ] ]
                ]
            ]
        ]


resultsTable : Rider -> List Results.Model.Result -> List Race.Model.Race -> Html msg
resultsTable rider results races =
    table []
        [ thead []
            [ tr []
                [ th [] [ text "id" ]
                , th [] [ text "Race" ]
                , th [] [ text "Date" ]
                , th [] [ text "Result" ]
                ]
            ]
        , tbody []
            (results
                |> List.map
                    (\result ->
                        raceRow result races
                    )
            )
        ]


raceRow : Results.Model.Result -> List Race.Model.Race -> Html msg
raceRow result races =
    let
        maybeRace =
            List.head
                (List.filter
                    (\race -> race.id == result.raceId)
                    races
                )
    in
        case maybeRace of
            Nothing ->
                tr []
                    [ td [] [ text "RaceId does not exist" ]
                    ]

            Just race ->
                tr []
                    [ td [] [ text (toString result.id) ]
                    , td []
                        [ a
                            [ href ("#races/" ++ (toString race.id)) ]
                            [ text race.name ]
                        ]
                    , td [] [ text race.date ]
                    , td [] [ text result.result ]
                    ]
