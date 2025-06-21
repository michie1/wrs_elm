module Page.Rider.Add.View exposing (view)

import Data.Licence as Licence exposing (Licence)
import Html exposing (Html, button, div, h2, input, label, span, text)
import Component.SubmitButton
import Component.TextInput
import Html.Attributes exposing (autofocus, checked, class, disabled, for, id, name, type_, value)
import Html.Events exposing (onClick, onInput)
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
        , Component.TextInput.view
            { id = "name"
            , label = "Name"
            , value = riderName
            , onInput = Msg.Name
            , autofocus = True
            , icon = Nothing
            , isHorizontal = False
            }
        , div [ class "field" ]
            [ label [ class "label" ] [ text "Licence" ]
            , licenceButtons add.licence
            ]
        , div [ class "field" ]
            [ div [ class "control" ]
                [ Component.SubmitButton.view
                    { text = "Add rider"
                    , onClick = Msg.Submit
                    , isDisabled = submitDisabled
                    , name = Just "action"
                    }
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
    label [ class "radio", for categoryName ]
        [ input [ checked isChecked, name "category", type_ "radio", id categoryName, onClick (Msg.Licence categoryModel) ] []
        , span [] [ text categoryText ]
        ]


licenceButtons : Maybe Licence -> Html Msg
licenceButtons maybeCurrent =
    div []
        [ licenceButtonCheck "elite" "Elite" Licence.Elite maybeCurrent
        , licenceButtonCheck "amateurs" "Amateurs" Licence.Amateurs maybeCurrent
        , licenceButtonCheck "basislidmaatschap" "Basislidmaatschap" Licence.Basislidmaatschap maybeCurrent
        , licenceButtonCheck "sportklasse" "Sportklasse" Licence.Sportklasse maybeCurrent
        , licenceButtonCheck "other" "Other" Licence.Other maybeCurrent
        ]
