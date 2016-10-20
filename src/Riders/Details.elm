module Riders.Details exposing (..)

--import Riders.Msg as Riders exposing (Msg(..))

import App.Model exposing (Mdl)
import Riders.Model exposing (Rider)


--exposing (Mdl)

import App.Msg
import App.Page
import App.Model

import Html exposing (Html, a, div, text)
import Html.Attributes exposing (href)

import Material.List as List
import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (Style, css)
import Material.Typography as Typo
import Material.Table as Table

import Results.Model
import Races.Model


--render : Maybe Rider -> List Results.Model.Result -> Mdl -> Html App.Msg.Msg
--render maybeRider results mdl =
render : App.Model.App -> Int -> Html App.Msg.Msg
render app riderId =
    let maybeRider = 
        List.head 
            ( List.filter 
                (\rider -> rider.id == riderId)
                app.riders
            )
    in 
        case maybeRider of
            Nothing ->
                div []
                    [ heading "Rider does not exist" ]
                         
            Just rider ->
                let 
                    results = 
                        List.filter 
                            (\result -> result.riderId == rider.id)
                            app.results
                in
                    div []
                        [ heading rider.name
                        , info rider
                        , resultsTable rider results app.races
                        ]

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
        
resultsTable : Rider -> List Results.Model.Result -> List Races.Model.Race -> Html msg
resultsTable rider results races =
    Table.table []
        [ Table.thead []
            [ Table.tr []
                [ Table.th [] [ text "id" ]
                , Table.th [] [ text "Race" ]
                , Table.th [] [ text "Date" ]
                , Table.th [] [ text "Result" ]
                ]
            ]
        , Table.tbody []
            (results
                |> List.map
                    (\result ->
                        raceRow result races
                    )
            )
        ]

raceRow : Results.Model.Result -> List Races.Model.Race -> Html msg
raceRow result races =
    let maybeRace = 
        List.head 
            ( List.filter 
                (\race -> race.id == result.raceId)
                races
            )
    in 
        case maybeRace of
            Nothing ->
                Table.tr []
                    [ Table.td [] [ text "RaceId does not exist" ]
                    ]
                         
            Just race ->
                Table.tr []
                    [ Table.td [] [ text (toString result.id) ]
                    , Table.td [] [ 
                                    a 
                                        [ href ("#races/" ++ (toString race.id)) ] 
                                        [ text race.name ]
                                    ]
                    , Table.td [] [ text race.name ]
                    , Table.td [] [ text result.result ]
                    ]
