module Page.Rider.Details exposing (view)

import App.Model
import App.Msg
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult, getPointsByResult, getPointsByResults)
import Data.Rider exposing (Rider)
import Html exposing (Html, a, dd, div, dl, dt, h2, p, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (class, href)
import Time exposing (Posix)


dateFormat : Posix -> String
dateFormat date =
    -- TODO: format date Date.Extra.Format.format config "%Y-%m-%d" date
    "hoi"


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
                [ h2 [ class "title is-2" ] [ text "Rider" ]
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
                [ h2 [ class "title is-2" ] [ text rider.name ]
                , info rider points
                , resultsTable riderResults races
                ]


info : Rider -> Int -> Html App.Msg.Msg
info rider points =
    div [ class "card" ]
        [ div [ class "card-content" ]
            [ div [ class "content" ]
                [ dl []
                    [ dt [] [ text "Name" ]
                    , dd [] [ text rider.name ]
                    , dt [] [ text "Licence" ]
                    , dd [] [ text (Debug.toString rider.licence) ]
                    , dt [] [ text "Points" ]
                    , dd [] [ text <| String.fromInt <| points ]
                    ]
                ]
            ]
        ]


resultsTable : List RaceResult -> List Race -> Html msg
resultsTable results races =
    table [ class "table" ]
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
                , td [] [ text <| String.fromInt <| getPointsByResult result races ]
                , td [] [ text result.result ]
                , td [] [ text <| Debug.toString result.outfit ]
                ]
