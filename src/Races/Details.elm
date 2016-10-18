module Races.Details exposing (..)

--import Races.Msg as Races exposing (Msg(..))
import Races.Model exposing (Race)

import App.Model 
--exposing (Mdl)
import App.Msg 
import App.Page

import Html exposing (Html, div, text)

import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (Style, css)
import Material.Typography as Typo
import Material.Table as Table


render : List Race -> App.Model.Mdl -> Html App.Msg.Msg
render races mdl =
  case List.head races of                  
    Nothing ->  
      div []
        [ text "Geen race" ]

    Just race ->
      div []
        [ div [] 
          [ text "Wel race" 
          ]
        , div [] 
          [ Button.render App.Msg.Mdl [0] mdl
            [ Button.raised 
            , Button.onClick ( App.Msg.GoTo App.Page.RaceAddPage )
            ] 
            [ text "HOI" 
            ]
          ]
        ]
