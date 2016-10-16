module RaceAdd.View exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)
--import App.Model exposing (Mdl)
--import App.Msg exposing (Msg)

import Material exposing (Model)
import Material.Button as Button
import Material.Textfield as Textfield
import Material.Typography as Typo
import Material.Options as Options exposing (css)
  

import RaceAdd.Msg as RaceAdd exposing (Msg(Mdl))

import Race.Model exposing (Race)


render : Race -> Material.Model -> Html RaceAdd.Msg
render race mdl =
  div [] 
    [ Options.styled Html.p 
      [ Typo.display2 ] 
      [ text "Add race!" ]
    , button [ ] [ text "hoi" ]
    , div [] 
      [ Textfield.render Mdl [2] mdl
          [ Textfield.label "Name"
          , Textfield.floatingLabel
          , Textfield.text' ]
      ]
    --, Button.render Material.Model [0] mdl
    --  [ Button.raised
      --, Button.onClick (Add race)
    --  ]
    --  [ text "Add" ]
    ]
  
-- Material.Model 
