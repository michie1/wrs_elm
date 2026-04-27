module Page.Rider.List exposing (view)

import App.Msg
import Data.Licence exposing (Licence, licenceLabel)
import Data.Payout
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult)
import Data.Rider exposing (Rider, getPointsByRiderId)
import Data.User exposing (User)
import Dict exposing (Dict)
import Html exposing (Html, a, button, div, h2, input, p, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (class, disabled, href, rel, style, target, type_, value)
import Html.Events exposing (onClick, onInput)
import String


type alias RiderPoints =
    { key : String
    , name : String
    , licence : Licence
    , points : Int
    }


view : Maybe User -> Bool -> Bool -> String -> Float -> Int -> List Rider -> List Race -> List RaceResult -> Html App.Msg.Msg
view maybeUser showPayoutColumn payoutModalOpen payoutPotDraft payoutPot minimumPayoutPoints riders races results =
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
        , actions maybeUser showPayoutColumn
        , div [ class "table-container" ]
            [ table [ class "table" ]
                [ thead []
                    [ tr []
                        ([ th [] [ text "Name" ]
                         , th [] [ text "Licence" ]
                         , th [] [ text "Points" ]
                         ]
                            ++
                                (if showPayoutColumn then
                                    [ th [] [ text "Provisional payout" ] ]

                                 else
                                    []
                                )
                        )
                    ]
                , tbody []
                    (riderPoints
                        |> List.map
                            (\rider ->
                                tr []
                                    ([ td []
                                        [ a [ href ("/riders/" ++ rider.key), style "display" "block" ]
                                            [ text rider.name ]
                                        ]
                                     , td [] [ text <| licenceLabel rider.licence ]
                                     , td [] [ text <| String.fromInt <| rider.points ]
                                     ]
                                        ++
                                            (if showPayoutColumn then
                                                [ td [] [ text <| formatPayoutCell (Dict.get rider.key provisionalPayouts |> Maybe.withDefault 0) ] ]

                                             else
                                                []
                                            )
                                    )
                            )
                    )
                ]
            ]
        , payoutModal payoutModalOpen payoutPotDraft
        ]


actions : Maybe User -> Bool -> Html App.Msg.Msg
actions maybeUser showPayoutColumn =
    div [ class "buttons" ] <|
        [ addButton ]
            ++
                (case maybeUser of
                    Just _ ->
                        [ payoutButton showPayoutColumn ]

                    Nothing ->
                        []
                )


addButton : Html App.Msg.Msg
addButton =
    a [ href "/riders/add", class "button" ] [ text "Add rider" ]


payoutButton : Bool -> Html App.Msg.Msg
payoutButton showPayoutColumn =
    button
        [ class "button"
        , disabled showPayoutColumn
        , onClick App.Msg.OpenPayoutModal
        ]
        [ text "Show provisional payout" ]


payoutModal : Bool -> String -> Html App.Msg.Msg
payoutModal payoutModalOpen payoutPotDraft =
    if payoutModalOpen then
        div [ class "modal is-active" ]
            [ div [ class "modal-background", onClick App.Msg.ClosePayoutModal ] []
            , div [ class "modal-card" ]
                [ div [ class "modal-card-head" ]
                    [ div []
                        [ h2 [ class "title is-4", style "margin" "0" ] [ text "Provisional payout settings" ]
                        , p [ class "subtitle is-6", style "margin" "0.5rem 0 0 0", style "color" "#666" ]
                            [ text "Enter the payout budget in euros to reveal the estimate column." ]
                        ]
                    ]
                , div [ class "modal-card-body" ]
                    [ p [ style "margin-top" "0", style "margin-bottom" "1rem" ]
                        [ text "This uses the provisional points-package calculation and is only meant as an estimate. The default value is €1000." ]
                    , p [ style "margin-top" "0", style "margin-bottom" "1.25rem" ]
                        [ text "Reference: "
                        , a
                            [ href "https://wtos.nl/wp-content/uploads/2025/12/Reglement-Puntenpakket.pdf"
                            , target "_blank"
                            , rel "noopener noreferrer"
                            ]
                            [ text "Reglement Puntenpakket" ]
                        ]
                    , div [ class "field" ]
                        [ p [ class "label", style "margin-bottom" "0.5rem" ] [ text "Payout budget (€)" ]
                        , div [ class "control" ]
                            [ input
                                [ class "input"
                                , type_ "text"
                                , value payoutPotDraft
                                , onInput App.Msg.UpdatePayoutPotDraft
                                ]
                                []
                            ]
                        ]
                    ]
                , div [ class "modal-card-foot buttons" ]
                    [ button [ class "button", onClick App.Msg.ClosePayoutModal ] [ text "Cancel" ]
                    , button [ class "button is-primary", onClick App.Msg.SubmitPayoutPot ] [ text "Show column" ]
                    ]
                ]
            ]

    else
        text ""

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
