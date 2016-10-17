module RaceAdd.View exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)
--import App.Model exposing (Mdl)
--import App.Msg 

import Material exposing (Model)
import Material.Button as Button
import Material.Textfield as Textfield
import Material.Typography as Typo
import Material.Options as Options exposing (css)
  
--import RaceAdd.Msg as RaceAdd exposing (Msg(..))
import RaceAdd.Model exposing (RaceAdd)

import Race.Model exposing (Race)

import App.Msg
import App.Model 



render : Race -> App.Model.Mdl -> Html App.Msg.Msg
render race mdl =
  div [] 
    [ Options.styled Html.p 
      [ Typo.display2 ] 
      [ text "Add race" ]
    , div [] 
      [ Textfield.render App.Msg.Mdl [2] mdl
          [ Textfield.label ("Name " ++ race.name)
          , Textfield.floatingLabel
          , Textfield.text'
          , Textfield.onInput App.Msg.SetName
          ]
      ]
    , Button.render App.Msg.Mdl [0] mdl
      [ Button.raised
      , Button.onClick (App.Msg.Add race)
      ]
      [ text "Add" ]
    ]
  
-- Material.Model 
