module Races.Details exposing (..)

--import Races.Msg as Races exposing (Msg(..))

import App.Model exposing (Mdl)
import Races.Model exposing (Race)


--exposing (Mdl)

import App.Msg
import App.Page
import Html exposing (Html, div, text)
import Material.List as List
import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (Style, css)
import Material.Typography as Typo
import Material.Table as Table


render : Maybe Race -> Mdl -> Html App.Msg.Msg
render maybeRace mdl =
    case maybeRace of
        Nothing ->
            div []
                [ heading "Race does not exist" ]

        Just race ->
            div []
                [ heading race.name
                , info race
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

info : Race -> Html App.Msg.Msg
info race =
    List.ul []
        [ li "Name" race.name
        , li "Date" race.name
        , li "Type" race.name
        , li "Points" race.name
        ]
