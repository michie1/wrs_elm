module App.View exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)
import Html.App

import App.Msg exposing (Msg(..))
import App.Model exposing (App, Rider, Page(..), Mdl)

import Race.Model exposing (Race)

import RaceAdd.View

import Races.List

import ViewRaces exposing (viewRaces)
import ViewRiders exposing (viewRiders)

import Material.Scheme
import Material.Options as Options exposing (css)
import Material.Typography as Typo
import Material.Layout as Layout
import Material.Textfield as Textfield

render : App -> Html Msg
render app =
  div []
    [ Layout.render Mdl app.mdl [ Layout.fixedHeader ]
      { header = [
        Layout.row []
          [ Layout.title [] 
              [ Layout.link
                  [ Layout.href "#home" ]
                  [ text "WRS" ]
              ]
          , Layout.navigation []
            [ Layout.link
                [ Layout.href "#races" ]
                [ text "Races" ]
            , Layout.link
                [ Layout.href "#riders" ]
                [ text "Riders" ]
            , Layout.link
                [ Layout.href "#race-add" ]
                [ text "Add race" ]
            ]
    
          ]
        ]
      , drawer = []
      , tabs = ([], [])
      , main = [ mainView app ]
      }
    ]
  |> Material.Scheme.top

mainView : App -> Html Msg
mainView app =
  div [] [ viewPage app ]

viewPage : App -> Html Msg
viewPage app = 
  case app.page of
    Home ->
      div [] 
        [ div [] 
          [ Textfield.render Mdl [2] app.mdl
              [ Textfield.label "hoi"
              , Textfield.floatingLabel
              , Textfield.text' 
              ]
          , div [] 
            [ Options.styled Html.p 
                [ Typo.display2 ] 
                [ text "HOME" ]
            , viewRider app
            ]
          ]
        ]
      
    Riders ->
      viewRiders app.riders
      
    Races ->
      --viewRaces app.races app.mdl
      div [] 
        [ Html.App.map RacesMsg (Races.List.render app.races)
        ]

    RaceAddPage -> 
      div [] 
        [ Html.App.map RaceAdd (RaceAdd.View.render app.raceAdd)
        ]

viewRider : App -> Html Msg
viewRider app =
  div [ ] [ 
    div [] [ text "Naam: " ]
  , div [] [ text app.rider.name ]
  , div [] [ text "Licentie: " ]
  , div [] [ text app.rider.licence ]
  ]

