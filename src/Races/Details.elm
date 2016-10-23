module Races.Details exposing (..)

--import Races.Msg as Races exposing (Msg(..))

import App.Model exposing (Mdl)
import Races.Model exposing (Race)
import Riders.Model
import Results.Model

--exposing (Mdl)

import App.Msg
import App.Page
import Html exposing (Html, a, div, text)
import Html.Attributes exposing (href, style)
import Material.List as List
import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (Style, css)
import Material.Typography as Typo
import Material.Table as Table


import Comments.List

render : App.Model.App -> Int -> Html App.Msg.Msg
render app raceId =
    let maybeRace = 
        List.head 
            ( List.filter 
                (\race -> race.id == raceId)
                app.races
            )
    in 
        case maybeRace of
            Nothing ->
                div []
                    [ heading "Rider does not exist" ]
                         
            Just race ->
                let 
                    results = 
                        List.filter 
                            (\result -> result.raceId == race.id)
                            app.results
                in
                    div []
                        [ div [ ] 
                            [ div [] 
                                [ heading race.name
                                , info race
                                ]
                            , div [] 
                                [ subHeading "Results"
                                , addResultButton race app.mdl
                                ]
                            , resultsTable race results app.riders
                            ]
                        , subHeading "Comments"
                        , addCommentButton race app.mdl
                        , Comments.List.render app race
                        ]


addResultButton : Races.Model.Race -> App.Model.Mdl -> Html App.Msg.Msg
addResultButton race mdl = 
    Button.render App.Msg.Mdl
        [ 0 ]
        mdl
        [ Button.raised
        , Button.onClick (App.Msg.GoTo (App.Page.ResultsAdd race.id))
        ]
        [ text "Add"
        ]
        
addCommentButton : Races.Model.Race -> App.Model.Mdl -> Html App.Msg.Msg
addCommentButton race mdl = 
    Button.render App.Msg.Mdl
        [ 0 ]
        mdl
        [ Button.raised
        , Button.onClick (App.Msg.GoTo (App.Page.CommentAdd race.id))
        ]
        [ text "Add"
        ]

heading : String -> Html App.Msg.Msg
heading title =
    Options.styled 
        Html.p
        [ Typo.display2 ]
        [ text title ]

subHeading : String -> Html App.Msg.Msg
subHeading title =
    Options.styled 
        Html.p
        [ Typo.display1 ]
        [ text title ]

li : String -> String -> Html App.Msg.Msg
li sub value =
    List.li [ List.withSubtitle ] 
        [ List.content [] 
            [ List.subtitle [] [ text sub ]
            , text value
            ]
        ]

info : Race -> Html App.Msg.Msg
info race =
    List.ul []
        [ li "Name" race.name
        , li "Date" race.name
        , li "Type" race.name
        , li "Points" race.name
        ]        

resultsTable : Race -> List Results.Model.Result -> List Riders.Model.Rider -> Html msg
resultsTable race results riders =
    Table.table []
        [ Table.thead []
            [ Table.tr []
                [ Table.th [] [ text "id" ]
                , Table.th [] [ text "Rider" ]
                , Table.th [] [ text "Date" ]
                , Table.th [] [ text "Result" ]
                ]
            ]
        , Table.tbody []
            (results
                |> List.map
                    (\result ->
                        riderRow result riders
                    )
            )
        ]

riderRow : Results.Model.Result -> List Riders.Model.Rider -> Html msg
riderRow result riders =
    let maybeRider = 
        List.head 
            ( List.filter 
                (\rider -> rider.id == result.riderId)
                riders
            )
    in 
        case maybeRider of
            Nothing ->
                Table.tr []
                    [ Table.td [] [ text "RiderId does not exist" ]
                    ]
                         
            Just rider ->
                Table.tr []
                    [ Table.td [] [ text (toString result.id) ]
                    , Table.td [] [ 
                                    a 
                                        [ href ("#riders/" ++ (toString rider.id)) ] 
                                        [ text rider.name ]
                                    ]
                    , Table.td [] [ text rider.name ]
                    , Table.td [] [ text result.result ]
                    ]
