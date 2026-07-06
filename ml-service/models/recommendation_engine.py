def generate_recommendations(category_totals, monthly_income, user_type="working_woman"):
    recommendations = []

    if monthly_income <= 0:
        return [{
            "type": "general_tip",
            "category": "",
            "message": "Add income records to receive personalized recommendations."
        }]

    # Example limits
    limits = {
        "Food": 0.15,
        "Shopping": 0.08,
        "Entertainment": 0.07,
    }

    total_spend = sum(category_totals.values())

    for category, percent in limits.items():
        spent = category_totals.get(category, 0)
        recommended = monthly_income * percent

        if spent > recommended:
            recommendations.append({
                "type": "overspending",
                "category": category,
                "message": (
                    f"You spent ₹{spent:.0f} on {category}, "
                    f"which is ₹{spent - recommended:.0f} above the "
                    f"recommended ₹{recommended:.0f}. "
                    f"Try trimming {category} spending next month."
                )
            })

    savings = monthly_income - total_spend
    savings_rate = (savings / monthly_income) * 100

    if savings_rate >= 20:
        recommendations.append({
            "type": "savings_tip",
            "category": "",
            "message": (
                f"Nice work - your savings rate is {savings_rate:.1f}%, "
                f"meeting or beating the 20% goal."
            )
        })
    else:
        recommendations.append({
            "type": "savings_tip",
            "category": "",
            "message": (
                f"Your savings rate is {savings_rate:.1f}%. "
                f"Try increasing it toward 20%."
            )
        })

    recommendations.append({
        "type": "general_tip",
        "category": "",
        "message": "Keep an emergency fund covering 3-6 months of expenses."
    })

    return recommendations