module Results.Add exposing (render)

import Html exposing (Html, button, div, text, span, input, ul, li)


import Material exposing (Model)
import Material.Button as Button
import Material.Textfield as Textfield
import Material.Typography as Typo
import Material.Options as Options exposing (css)


import App.Model exposing (Mdl)
import Results.Model 
import App.Msg

render : Results.Model.Result -> Mdl -> Html App.Msg.Msg
render result mdl =
    div []
        [ Options.styled Html.p
            [ Typo.display2 ]
            [ text "Add result" ]
        , div []
            [ resultField result.result mdl
            , idField result.riderId "Rider" mdl App.Msg.SetResultRider
            , idField result.raceId "Race" mdl App.Msg.SetResultRace
            ]
        , Button.render App.Msg.Mdl
            [ 0 ]
            mdl
            [ Button.raised
            , Button.onClick (App.Msg.AddResult result)
            ]
            [ text "Add" ]
        ]

resultField : String -> Mdl -> Html App.Msg.Msg
resultField result mdl =
    div [] 
        [ Textfield.render App.Msg.Mdl
            [ 2 ]
            mdl
            [ Textfield.label ("Result " ++ result)
            , Textfield.floatingLabel
            , Textfield.text'
            , Textfield.onInput App.Msg.SetResultResult
            ]
        ]

idField : Int -> String -> Mdl -> (String -> App.Msg.Msg) -> Html App.Msg.Msg
idField id label mdl msg =
    div [] 
        [ Textfield.render App.Msg.Mdl
            [ 2 ]
            mdl
            [ Textfield.label (label ++ " " ++ (toString id) )
            , Textfield.floatingLabel
            , Textfield.text'
            , Textfield.onInput msg ]
        ]
