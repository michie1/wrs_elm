module Rider.View.Add exposing (render)

import Html exposing (Html, node, p, form, button, div, text, span, input, ul, li, a, i, h2, label)
import Html.Attributes exposing (attribute, autofocus, value, autofocus, class, name, type_, id, for, checked, disabled)
import Html.Events exposing (onClick, onInput)

import App.Msg
import Rider.Model

render : Rider.Model.Add -> Html App.Msg.Msg
render add =
    let
        name =
            add.name

        submitDisabled =
            name == "" || add.licence == Nothing

    in
        div []
            [ h2 [] [ text "Add rider" ]
            , div []
                [ div [ class "row" ]
                    [ div [ class "col s6 input-field" ]
                        [ input
                            [ id "name"
                            , type_ "text"
                            , onInput App.Msg.RiderAddName
                            , autofocus True
                            , value name
                            ]
                            []
                        , label [ for "name" ] [ text "Name" ]
                        ]
                    ]
                , div [ class "row" ] [ categoryButtons add.licence ]
                , div [ class "row" ]
                    [ div [ class "col s6" ]
                        [ button
                            [ class "waves-effect waves-light btn"
                            , type_ "submit"
                            , onClick App.Msg.RiderAddSubmit
                            , Html.Attributes.name "action"
                            , disabled submitDisabled
                            ]
                            [ text "Add rider"
                            , i [ class "material-icons right" ] [ text "send" ]
                            ]
                        ]
                    ]
                ]
            ]
 
categoryButtonCheck : String -> String -> Rider.Model.Licence -> Maybe Rider.Model.Licence -> Html App.Msg.Msg
categoryButtonCheck categoryName categoryText categoryModel maybeCurrent =
    let
        isChecked =
            case maybeCurrent of
                Just current ->
                    categoryModel == current
                Nothing ->
                    False
    in
        p []
            [ input [ checked isChecked, name "category", type_ "radio", id categoryName, onClick (App.Msg.RiderAddLicence categoryModel) ] []
            , label [ for categoryName ] [ text categoryText ]
            ]

categoryButtons : Maybe Rider.Model.Licence -> Html App.Msg.Msg
categoryButtons maybeCurrent =
    div [ class "col s6" ]
        [ label [ class "active" ] [ text "Category" ]
        , categoryButtonCheck "elite" "Elite" Rider.Model.Elite maybeCurrent
        , categoryButtonCheck "amateurs" "Amateurs" Rider.Model.Amateurs maybeCurrent
        , categoryButtonCheck "basislidmaatschap" "Basislidmaatschap" Rider.Model.Basislidmaatschap maybeCurrent
        , categoryButtonCheck "other" "Other" Rider.Model.Other maybeCurrent
        ]
