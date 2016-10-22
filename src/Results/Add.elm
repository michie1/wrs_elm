module Results.Add exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)


import Material exposing (Model)
import Material.Button as Button
import Material.Textfield as Textfield
import Material.Typography as Typo
import Material.Options as Options exposing (css)


import App.Model exposing (Mdl)
import App.Msg

import Results.Model 
import Races.Model
import Riders.Model

render : Races.Model.Race -> Results.Model.ResultAdd -> List Riders.Model.Rider -> Mdl -> Html App.Msg.Msg
render race resultAdd riders mdl =
    div []
        [ heading ("Add result for " ++ race.name)
        , div []
            [ field 0 "Result" App.Msg.SetResultResult mdl
            , field 1 "Rider name" App.Msg.SetResultRiderName mdl
            ]
        , addButton mdl
        ]

heading : String -> Html App.Msg.Msg
heading headingText =
    Options.styled 
        Html.p
        [ Typo.display2 ]
        [ text headingText ]
        

field : Int -> String -> (String -> App.Msg.Msg) -> Mdl -> Html App.Msg.Msg
field index label msg mdl =
    div [] 
        [ Textfield.render App.Msg.Mdl
            [ index ]
            mdl
            [ Textfield.label label
            , Textfield.floatingLabel
            , Textfield.text'
            , Textfield.onInput msg
            ]
        ]


addButton : Mdl -> Html App.Msg.Msg
addButton mdl =
    Button.render App.Msg.Mdl
        [ 0 ]
        mdl
        [ Button.raised
        , Button.onClick (App.Msg.AddResult)
        ]
        [ text "Add" ]
