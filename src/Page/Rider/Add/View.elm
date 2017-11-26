module Page.Rider.Add.View exposing (view)

import Html exposing (Html, p, button, div, text, input, i, h2, label, span)
import Html.Attributes exposing (value, autofocus, class, name, type_, id, for, checked, disabled)
import Html.Events exposing (onClick, onInput)
import Data.Licence as Licence exposing (Licence)
import Page.Rider.Add.Model exposing (Model)
import Page.Rider.Add.Msg as Msg exposing (Msg)


view : Model -> Html Msg
view add =
    let
        riderName =
            add.name

        submitDisabled =
            riderName == "" || add.licence == Nothing || String.length riderName > 100
    in
        div []
            [ h2 [ class "title is-2" ] [ text "Add rider" ]
            , div [ class "field" ]
                [ label [ class "label", for "name" ] [ text "Name" ]
                , div [ class "control" ]
                    [ input
                        [ id "name"
                        , class "input"
                        , type_ "text"
                        , onInput Msg.Name
                        , autofocus True
                        , value riderName
                        ]
                        []
                    ]
                ]
            , licenceButtons add.licence
            , div [ class "field" ]
                [ div [ class "control" ]
                    [ button
                        [ class "button"
                        , class "is-primary"
                        , type_ "submit"
                        , onClick Msg.Submit
                        , Html.Attributes.name "action"
                        , disabled submitDisabled
                        ]
                        [ text "Add rider" ]
                    ]
                ]
            ]


licenceButtonCheck : String -> String -> Licence -> Maybe Licence -> Html Msg
licenceButtonCheck categoryName categoryText categoryModel maybeCurrent =
    let
        isChecked =
            case maybeCurrent of
                Just current ->
                    categoryModel == current

                Nothing ->
                    False
    in
        label []
            [ input [ checked isChecked, name "category", type_ "radio", id categoryName, onClick (Msg.Licence categoryModel) ] []
            , span [] [ text categoryName ]
            ]


licenceButtons : Maybe Licence -> Html Msg
licenceButtons maybeCurrent =
    div [ class "control" ]
        [ licenceButtonCheck "elite" "Elite" Licence.Elite maybeCurrent
        , licenceButtonCheck "amateurs" "Amateurs" Licence.Amateurs maybeCurrent
        , licenceButtonCheck "basislidmaatschap" "Basislidmaatschap" Licence.Basislidmaatschap maybeCurrent
        , licenceButtonCheck "other" "Other" Licence.Other maybeCurrent
        ]
