module Page.Rider.List exposing (view)

import App.Msg
import Data.Licence exposing (Licence, licenceLabel)
import Data.Payout
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Data.Rider exposing (Rider, getPointsByRiderId)
import Dict exposing (Dict)
import Html exposing (Html, a, div, h2, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (class, href, style)
import String


type alias RiderPoints =
    { key : String
    , name : String
    , licence : Licence
    , points : Int
    }


view : Float -> Int -> List Rider -> List Race -> List RaceResult -> Html App.Msg.Msg
view payoutPot minimumPayoutPoints riders races results =
    let
        riderPoints =
            riders
                |> List.map
                    (\rider ->
                        { key = rider.key
                        , name = rider.name
                        , licence = rider.licence
                        , points = getPointsByRiderId rider.key results races
                        }
                    )
                |> List.sortBy .points
                |> List.reverse

        provisionalPayouts =
            Data.Payout.payoutEstimates payoutPot minimumPayoutPoints
                (List.map (\rider -> { riderId = rider.key, points = rider.points }) riderPoints)
    in
    div []
        [ h2 [ class "title is-2" ] [ text "Riders" ]
        , addButton
        , div [ class "table-container" ]
            [ table [ class "table" ]
                [ thead []
                    [ tr []
                        [ th [] [ text "Name" ]
                        , th [] [ text "Licence" ]
                        , th [] [ text "Points" ]
                        , th [] [ text "Provisional payout" ]
                        ]
                    ]
                , tbody []
                    (riderPoints
                        |> List.map
                            (\rider ->
                                tr []
                                    [ td []
                                        [ a [ href ("/riders/" ++ rider.key), style "display" "block" ]
                                            [ text rider.name ]
                                        ]
                                    , td [] [ text <| licenceLabel rider.licence ]
                                    , td [] [ text <| String.fromInt <| rider.points ]
                                    , td [] [ text <| formatPayoutCell (Dict.get rider.key provisionalPayouts |> Maybe.withDefault 0) ]
                                    ]
                            )
                    )
                ]
            ]
        ]


addButton : Html App.Msg.Msg
addButton =
    a [ href "/riders/add", class "button" ] [ text "Add rider" ]

formatEuro : Float -> String
formatEuro amount =
    let
        roundedCents =
            round (amount * 100)

        euros =
            roundedCents // 100

        cents =
            modBy 100 roundedCents

        centsString =
            if cents < 10 then
                "0" ++ String.fromInt cents

            else
                String.fromInt cents
    in
    "€" ++ String.fromInt euros ++ "." ++ centsString


formatPayoutCell : Float -> String
formatPayoutCell amount =
    if amount <= 0 then
        ""

    else
        formatEuro amount
