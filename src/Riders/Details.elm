module Riders.Details exposing (..)

--import Riders.Msg as Riders exposing (Msg(..))

import App.Model exposing (Mdl)
import Riders.Model exposing (Rider)


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


render : Maybe Rider -> Mdl -> Html App.Msg.Msg
render maybeRider mdl =
    case maybeRider of
        Nothing ->
            div []
                [ heading "Rider does not exist" ]

        Just rider ->
            div []
                [ heading rider.name
                , info rider
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
