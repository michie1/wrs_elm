module Rider.View.Add exposing (render)

import Html exposing (Html, node, p, form, button, div, text, span, input, ul, li, a, i, h2, label)
import Html.Attributes exposing (attribute, autofocus, value, autofocus, class, name, type_, id, for, checked, disabled)
import Html.Events exposing (onClick, onInput)
import App.Msg
import Rider.Model
import Data.Licence as Licence exposing (Licence)


render : Rider.Model.Add -> Html App.Msg.Msg
render add =
    let
        name =
            add.name

        submitDisabled =
            name == "" || add.licence == Nothing || String.length name > 100
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
                , div [ class "row" ] [ licenceButtons add.licence ]
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


licenceButtonCheck : String -> String -> Licence -> Maybe Licence -> Html App.Msg.Msg
licenceButtonCheck categoryName categoryText categoryModel maybeCurrent =
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


licenceButtons : Maybe Licence -> Html App.Msg.Msg
licenceButtons maybeCurrent =
    div [ class "col s6" ]
        [ label [ class "active" ] [ text "Category" ]
        , licenceButtonCheck "elite" "Elite" Licence.Elite maybeCurrent
        , licenceButtonCheck "amateurs" "Amateurs" Licence.Amateurs maybeCurrent
        , licenceButtonCheck "basislidmaatschap" "Basislidmaatschap" Licence.Basislidmaatschap maybeCurrent
        , licenceButtonCheck "other" "Other" Licence.Other maybeCurrent
        ]
