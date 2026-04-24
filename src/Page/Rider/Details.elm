module Page.Rider.Details exposing (view)

import App.Helpers exposing (formatDate)
import App.Model
import App.Msg
import App.Page
import Data.Licence exposing (licenceLabel)
import Data.Outfit exposing (outfitToString)
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult, getPointsByResult, getPointsByResults)
import Data.Rider exposing (Rider)
import Html exposing (Html, a, dd, div, dl, dt, h2, i, p, span, table, tbody, td, text, th, thead, tr)
import Html.Attributes exposing (class, href, style)
import Html.Events exposing (onClick)
import Page.Rider.Edit.Model as RiderEdit


view : App.Model.App -> String -> List Race -> List Rider -> List RaceResult -> Html App.Msg.Msg
view app riderKey races riders results =
    let
        maybeRider =
            List.head
                (List.filter
                    (\rider -> rider.key == riderKey)
                    riders
                )

        signedIn =
            app.user /= Nothing
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
                , info rider points signedIn
                , resultsTable riderResults races
                ]


editButton : Rider -> Html App.Msg.Msg
editButton rider =
    let
        riderEdit =
            { riderName = rider.name
            , riderKey = rider.key
            , currentLicence = rider.licence
            , licence = rider.licence
            }
    in
    a
        [ href ("/riders/" ++ rider.key ++ "/edit")
        , style "display" "inline-block"
        , style "margin-left" "0.5rem"
        , onClick (App.Msg.Navigate (App.Page.RiderEdit riderEdit))
        ]
        [ span [ class "icon" ] [ i [ class "fas fa-pencil-alt" ] [ text "" ] ] ]


info : Rider -> Int -> Bool -> Html App.Msg.Msg
info rider points signedIn =
    div [ class "card" ]
        [ div [ class "card-content" ]
            [ div [ class "content" ]
                [ dl []
                    [ dt [] [ text "Name" ]
                    , dd [] [ text rider.name ]
                    , dt [] [ text "KNWU Licence" ]
                    , dd []
                        [ span [] [ text <| licenceLabel rider.licence ]
                        , if signedIn then
                            editButton rider

                          else
                            text ""
                        ]
                    , dt [] [ text "Points" ]
                    , dd [] [ text <| String.fromInt <| points ]
                    ]
                ]
            ]
        ]


resultsTable : List RaceResult -> List Race -> Html msg
resultsTable results races =
    div [ class "table-container" ]
        [ table [ class "table" ]
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
                    formatDate race.date
            in
            tr []
                [ td []
                    [ a
                        [ href ("/races/" ++ race.key) ]
                        [ text race.name ]
                    ]
                , td [] [ text <| dateString ]
                , td [] [ text <| String.fromInt <| getPointsByResult result races ]
                , td [] [ text result.result ]
                , td [] [ text <| outfitToString result.outfit ]
                ]
