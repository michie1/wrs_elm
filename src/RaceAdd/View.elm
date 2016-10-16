module RaceAdd.View exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)
--import App.Model exposing (Mdl)
--import App.Msg 

import Material exposing (Model)
import Material.Button as Button
import Material.Textfield as Textfield
import Material.Typography as Typo
import Material.Options as Options exposing (css)
  
import RaceAdd.Msg as RaceAdd exposing (Msg(..))
import RaceAdd.Model exposing (RaceAdd)

import Race.Model exposing (Race)




render : RaceAdd -> Html RaceAdd.Msg
render raceAdd =
  div [] 
    [ Options.styled Html.p 
      [ Typo.display2 ] 
      [ text "Add race" ]
    , div [] 
      [ Textfield.render Mdl [2] raceAdd.mdl
          [ Textfield.label "Name" 
          , Textfield.floatingLabel
          , Textfield.text'
          , Textfield.onInput SetName
          ]
      ]
    , Button.render Mdl [0] raceAdd.mdl
      [ Button.raised
      --, Button.onClick (Add race)
      ]
      [ text "Add" ]
    ]
  
-- Material.Model 
