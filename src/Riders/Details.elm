module Riders.Details exposing (..)

--import Riders.Msg as Riders exposing (Msg(..))

import App.Model 
import Riders.Model exposing (Rider)


--exposing (Mdl)

import App.Msg
import App.Model
import Html exposing (Html, a, div, text, table, tr, td, th, thead, tbody, ul, li)
import Html.Attributes exposing (href)
--import Material.List as List
--import Material.Options as Options exposing (Style, css)
--import Material.Typography as Typo
--import Material.Table as Table
import Results.Model
import Races.Model


--render : Maybe Rider -> List Results.Model.Result -> Mdl -> Html App.Msg.Msg
--render maybeRider results mdl =


render : App.Model.App -> Int -> Html App.Msg.Msg
render app riderId =
    let
        maybeRider =
            List.head
                (List.filter
                    (\rider -> rider.id == riderId)
                    app.riders
                )
    in
        case maybeRider of
            Nothing ->
                div []
                    [ --heading "Rider does not exist" 
                    ]

            Just rider ->
                let
                    results =
                        List.filter
                            (\result -> result.riderId == rider.id)
                            app.results
                in
                    div []
                        [ --heading rider.name
                        --, info rider
                         resultsTable rider results app.races
                        ]


{--
heading : String -> Html App.Msg.Msg
heading title =
    Options.styled
        Html.p
        [ Typo.display2 ]
        [ text title ]


li : String -> String -> Html App.Msg.Msg
li sub value =
    List.li [ List.withSubtitle ]
        [ List.content []
            [ List.subtitle [] [ text sub ]
            , text value
            ]
        ]


info : Rider -> Html App.Msg.Msg
info rider =
    List.ul []
        [ li "Name" rider.name
        , li "Licence" rider.licence
        , li "Points" rider.name
        ]

--}

resultsTable : Rider -> List Results.Model.Result -> List Races.Model.Race -> Html msg
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


raceRow : Results.Model.Result -> List Races.Model.Race -> Html msg
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
                    , td [] [ text race.name ]
                    , td [] [ text result.result ]
                    ]
