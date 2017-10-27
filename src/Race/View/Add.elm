module Race.View.Add exposing (render)

import Html exposing (Html, node, p, form, button, div, text, span, input, ul, li, a, i, h2, label)
import Html.Attributes exposing (attribute, autofocus, value, autofocus, class, name, type_, id, for, checked, disabled)
import Html.Events exposing (onClick, onInput)
import App.Msg
import Race.Model exposing (Race)
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import Date
import Ui.Calendar


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d" date


render : Race.Model.Add -> Html App.Msg.Msg
render raceAdd =
    let
        name =
            raceAdd.name

        submitDisabled =
            name == "" || String.length name > 100

        dateString = dateFormat raceAdd.calendar.value
    in
        div []
            [ h2 [] [ text "Add Race" ]
            , div []
                [ div [ class "row" ]
                    [ div [ class "col s6 input-field" ]
                        [ input
                            [ id "name"
                            , type_ "text"
                            , onInput App.Msg.RaceName
                            , autofocus True
                            , value name
                            ]
                            []
                        , label [ for "name" ] [ text "Name" ]
                        ]
                    ]
                , div [ class "row" ] [ categoryButtons raceAdd.category ]
                , div [] [ Html.map App.Msg.Calendar (Ui.Calendar.view "en_us" raceAdd.calendar) ]
                , div [ class "row" ]
                    [ div [ class "col s6" ]
                        [ button
                            [ class "waves-effect waves-light btn"
                            , type_ "submit"
                            , onClick App.Msg.RaceAddSubmit
                            , Html.Attributes.name "action"
                            , disabled submitDisabled
                            ]
                            [ text "Add Race"
                            , i [ class "material-icons right" ] [ text "send" ]
                            ]
                        ]
                    ]
                ]
            ]


categoryButtonCheck : String -> String -> Race.Model.Category -> Race.Model.Category -> Html App.Msg.Msg
categoryButtonCheck categoryName categoryText categoryModel current =
    let
        isChecked =
            categoryModel == current
    in
        p []
            [ input [ checked isChecked, name "category", type_ "radio", id categoryName, onClick (App.Msg.RaceAddCategory categoryModel) ] []
            , label [ for categoryName ] [ text categoryText ]
            ]


categoryButtons : Race.Model.Category -> Html App.Msg.Msg
categoryButtons current =
    div [ class "col s6" ]
        [ label [ class "active" ] [ text "Category" ]
        , categoryButtonCheck "classic" "Klassieker" Race.Model.Classic current
        , categoryButtonCheck "criterum" "Criterium" Race.Model.Criterium current
        , categoryButtonCheck "regiocross" "Regiocross" Race.Model.Regiocross current
        , categoryButtonCheck "other" "Other" Race.Model.Other current
        ]


datepicker : String -> Html App.Msg.Msg
datepicker dateString =
    let
        inputDate =
            Debug.log "dateString" (String.join "/" (String.split "-" dateString))
    in
        div [ class "col s6" ]
            [ label [ class "active" ] [ text "Date" ]
            , node "app-datepicker"
                [ id "datepicker"
                , attribute "first-day-of-week" "1"
                , attribute "input-date" inputDate
                , attribute "disable-days" "[]"
                , attribute "auto-update-date" "true"
                ]
                []
            ]
