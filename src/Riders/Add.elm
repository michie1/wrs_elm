module Riders.Add exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)
import Material.Button as Button
import Material.Textfield as Textfield
import Material.Typography as Typo
import Material.Options as Options exposing (css)
import App.Model exposing (Mdl)
import Riders.Model exposing (Rider)
import App.Msg


type alias RiderAdd =
    { rider : Rider
    }


initial : RiderAdd
initial =
    { rider = (Rider 0 "Initial" "")
    }


render : Rider -> Mdl -> Html App.Msg.Msg
render rider mdl =
    div []
        [ Options.styled Html.p
            [ Typo.display2 ]
            [ text "Add rider" ]
        , div []
            [ Textfield.render App.Msg.Mdl
                [ 2 ]
                mdl
                [ Textfield.label ("Name " ++ rider.name)
                , Textfield.floatingLabel
                , Textfield.text'
                , Textfield.onInput App.Msg.SetRiderName
                ]
            ]
        , Button.render App.Msg.Mdl
            [ 0 ]
            mdl
            [ Button.raised
            , Button.onClick (App.Msg.AddRider rider)
            ]
            [ text "Add" ]
        ]
